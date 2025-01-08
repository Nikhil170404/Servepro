import { db } from '../firebase/config';
import { collection, addDoc, query, getDocs, orderBy, limit } from 'firebase/firestore';

// Learning system for the chatbot
class ChatbotLearning {
  constructor() {
    this.learningCollection = 'chatbotLearning';
    this.conversationsCollection = 'chatbotConversations';
    this.threshold = 0.6;
    this.positiveWords = new Set([
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'helpful',
      'thanks', 'thank', 'appreciate', 'perfect', 'awesome', 'love',
      'best', 'fantastic', 'outstanding', 'brilliant', 'superb'
    ]);
    this.negativeWords = new Set([
      'bad', 'poor', 'terrible', 'unhelpful', 'wrong', 'not', "don't",
      'cant', 'cannot', 'awful', 'horrible', 'disappointed', 'waste',
      'useless', 'difficult', 'confusing', 'confused'
    ]);
  }

  // Calculate similarity between two strings
  calculateSimilarity(str1, str2) {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    const matrix = Array(s2.length + 1).fill().map(() => Array(s1.length + 1).fill(0));
    
    for (let i = 0; i <= s1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= s2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= s2.length; j++) {
      for (let i = 1; i <= s1.length; i++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1,
          matrix[j][i - 1] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }
    
    return 1 - matrix[s2.length][s1.length] / Math.max(s1.length, s2.length);
  }

  // Extract keywords from text
  extractKeywords(text) {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to',
      'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'over',
      'after', 'is', 'are', 'was', 'were', 'be', 'been', 'being'
    ]);

    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => !stopWords.has(word) && word.length > 2);

    // Extract phrases (2-3 words)
    const phrases = [];
    for (let i = 0; i < words.length - 1; i++) {
      phrases.push(words[i] + ' ' + words[i + 1]);
      if (i < words.length - 2) {
        phrases.push(words[i] + ' ' + words[i + 1] + ' ' + words[i + 2]);
      }
    }

    return [...words, ...phrases];
  }

  // Learn from user interaction
  async learnFromInteraction(userMessage, botResponse, userFeedback) {
    try {
      const keywords = this.extractKeywords(userMessage);
      const sentiment = this.analyzeSentiment(userMessage);
      
      const learningData = {
        userMessage,
        botResponse,
        keywords,
        feedback: userFeedback,
        sentiment,
        timestamp: new Date(),
        usageCount: 1
      };

      await addDoc(collection(db, this.learningCollection), learningData);
      return true;
    } catch (error) {
      console.error('Error learning from interaction:', error);
      return false;
    }
  }

  // Learn from conversation context
  async learnFromContext(conversation) {
    try {
      const patterns = this.extractConversationPatterns(conversation);
      const contextData = {
        messages: conversation,
        patterns,
        timestamp: new Date(),
        sentiment: conversation.map(msg => ({
          message: msg.message,
          sentiment: msg.sentiment || this.analyzeSentiment(msg.message)
        }))
      };

      await addDoc(collection(db, this.conversationsCollection), contextData);
      return true;
    } catch (error) {
      console.error('Error learning from context:', error);
      return false;
    }
  }

  // Extract conversation patterns
  extractConversationPatterns(conversation) {
    const patterns = [];
    for (let i = 0; i < conversation.length - 1; i++) {
      if (conversation[i].sender === 'user' && conversation[i + 1].sender === 'bot') {
        const context = i > 0 ? conversation[i - 1].message : null;
        const userMessage = conversation[i].message;
        const botResponse = conversation[i + 1].message;
        const keywords = this.extractKeywords(userMessage);
        
        patterns.push({
          context,
          userMessage,
          botResponse,
          keywords,
          sentiment: conversation[i].sentiment || this.analyzeSentiment(userMessage)
        });
      }
    }
    return patterns;
  }

  // Find similar learned responses
  async findSimilarResponses(userMessage, context = []) {
    try {
      const keywords = this.extractKeywords(userMessage);
      const currentSentiment = this.analyzeSentiment(userMessage);
      
      const q = query(
        collection(db, this.learningCollection),
        orderBy('usageCount', 'desc'),
        limit(5)
      );

      const querySnapshot = await getDocs(q);
      const responses = [];

      querySnapshot.forEach(doc => {
        const data = doc.data();
        const keywordMatch = keywords.some(keyword => 
          data.keywords.includes(keyword)
        );

        if (keywordMatch) {
          const similarity = this.calculateSimilarity(userMessage, data.userMessage);
          const sentimentMatch = Math.abs(currentSentiment.score - data.sentiment.score) < 1;
          
          if (similarity >= this.threshold && sentimentMatch) {
            responses.push({
              response: data.botResponse,
              similarity,
              sentiment: data.sentiment,
              feedback: data.feedback
            });
          }
        }
      });

      return responses.sort((a, b) => b.similarity - a.similarity);
    } catch (error) {
      console.error('Error finding similar responses:', error);
      return [];
    }
  }

  // Get contextual suggestions
  async getContextualSuggestions(conversation) {
    try {
      const recentMessages = conversation.slice(-3);
      const currentSentiment = recentMessages.length > 0
        ? this.analyzeSentiment(recentMessages[recentMessages.length - 1].message)
        : null;

      const q = query(
        collection(db, this.conversationsCollection),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      const suggestions = new Map();

      querySnapshot.forEach(doc => {
        const data = doc.data();
        data.patterns.forEach(pattern => {
          if (pattern.context) {
            recentMessages.forEach(msg => {
              const contextSimilarity = this.calculateSimilarity(msg.message, pattern.context);
              const sentimentMatch = currentSentiment
                ? Math.abs(currentSentiment.score - pattern.sentiment.score) < 1
                : true;

              if (contextSimilarity >= this.threshold && sentimentMatch) {
                const key = pattern.botResponse;
                const currentScore = suggestions.get(key) || 0;
                suggestions.set(key, currentScore + contextSimilarity);
              }
            });
          }
        });
      });

      return Array.from(suggestions.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([suggestion]) => suggestion);
    } catch (error) {
      console.error('Error getting contextual suggestions:', error);
      return [];
    }
  }

  // Analyze conversation sentiment
  analyzeSentiment(text) {
    const words = text.toLowerCase().split(/\s+/);
    let score = 0;
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (this.positiveWords.has(word)) {
        score += 1;
        positiveCount++;
      }
      if (this.negativeWords.has(word)) {
        score -= 1;
        negativeCount++;
      }
    });
    
    const intensity = Math.abs(score) / words.length;
    const sentiment = score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
    
    return {
      score,
      sentiment,
      intensity,
      stats: {
        positiveWords: positiveCount,
        negativeWords: negativeCount,
        totalWords: words.length
      }
    };
  }

  // Generate dynamic response
  async generateDynamicResponse(userMessage, context) {
    try {
      const similarResponses = await this.findSimilarResponses(userMessage, context);
      const contextualSuggestions = await this.getContextualSuggestions(context);
      const sentiment = this.analyzeSentiment(userMessage);

      // If we have similar responses with good feedback, use them
      if (similarResponses.length > 0) {
        const bestResponse = similarResponses[0];
        if (bestResponse.feedback && bestResponse.feedback.rating > 0.7) {
          return {
            text: bestResponse.response,
            confidence: bestResponse.similarity,
            suggestions: contextualSuggestions,
            sentiment: sentiment,
            source: 'learned'
          };
        }
      }

      // Return null if no good learned response found
      return null;
    } catch (error) {
      console.error('Error generating dynamic response:', error);
      return null;
    }
  }
}

export const chatbotLearning = new ChatbotLearning();
