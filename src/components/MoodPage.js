import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import LoadingIcon from './LoadingIcon';

function MoodPage({ transactions = [] }) {
  const { user } = useAuth();
  const [userNickname, setUserNickname] = useState(null);
  
  const expenses = useMemo(() => transactions.filter((t) => t.type === 'expense'), [transactions]);
  const expensesWithMood = useMemo(() => expenses.filter((t) => t.mood), [expenses]);
  
  // 프로필 닉네임 로드
  useEffect(() => {
    const loadNickname = async () => {
      if (!user) {
        setUserNickname(null);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('nickname')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (data?.nickname) {
          setUserNickname(data.nickname);
        }
      } catch (error) {
        console.error('Error loading nickname:', error);
      }
    };
    
    loadNickname();
  }, [user]);

  // Helper function to parse transaction date
  const parseTransactionDate = (dateStr) => {
    if (!dateStr) return null;
    
    // Try YYYY-MM-DD format first
    const yyyyMMddMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (yyyyMMddMatch) {
      const year = parseInt(yyyyMMddMatch[1], 10);
      const month = parseInt(yyyyMMddMatch[2], 10) - 1;
      const day = parseInt(yyyyMMddMatch[3], 10);
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      return date;
    }

    // Try "Mon Day" format (e.g., "Nov 30")
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthDayMatch = dateStr.match(/([A-Za-z]+)\s+(\d{1,2})/);
    if (monthDayMatch) {
      const monthName = monthDayMatch[1];
      const day = parseInt(monthDayMatch[2], 10);
      const monthIndex = monthNames.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
      if (monthIndex !== -1) {
        const currentYear = new Date().getFullYear();
        const date = new Date(currentYear, monthIndex, day);
        date.setHours(0, 0, 0, 0);
        return date;
      }
    }

    // Try MM/DD format (e.g., "11/30")
    const mmddMatch = dateStr.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/);
    if (mmddMatch) {
      const month = parseInt(mmddMatch[1], 10) - 1;
      const day = parseInt(mmddMatch[2], 10);
      const year = mmddMatch[3] ? parseInt(mmddMatch[3], 10) : new Date().getFullYear();
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    
    return null;
  };

  // Helper function to parse time and get hour
  const getHourFromTime = (timeStr) => {
    if (!timeStr) return null;
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      return parseInt(timeMatch[1], 10);
    }
    return null;
  };

  // Get time of day category
  const getTimeOfDay = (hour) => {
    if (hour === null || hour === undefined) return 'Unknown';
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 22) return 'Evening';
    return 'Night';
  };

  // 픽셀 스타일 progress bar를 위한 블록 생성 함수
  const createPixelBlocks = (percentage, blockSize = 5) => {
    const blocks = [];
    const numBlocks = Math.floor(percentage / blockSize);
    const remainder = percentage % blockSize;
    
    for (let i = 0; i < numBlocks; i++) {
      blocks.push(blockSize);
    }
    if (remainder > 0) {
      blocks.push(remainder);
    }
    
    return blocks;
  };

  const moodStats = useMemo(() => {
    const base = {
      happy: { count: 0, total: 0, emoji: '🙂', label: 'Happy', average: 0 },
      neutral: { count: 0, total: 0, emoji: '😐', label: 'Neutral', average: 0 },
      sad: { count: 0, total: 0, emoji: '🫠', label: 'Sad', average: 0 },
    };

    expensesWithMood.forEach((expense) => {
      const key = expense.mood;
      if (key && base[key]) {
        base[key].count += 1;
        base[key].total += Math.abs(expense.amount);
      }
    });

    Object.keys(base).forEach(moodKey => {
      if (base[moodKey].count > 0) {
        base[moodKey].average = base[moodKey].total / base[moodKey].count;
      }
    });

    return base;
  }, [expensesWithMood]);

  const totalMoodCount = useMemo(
    () => expensesWithMood.reduce((sum, t) => sum + (t.mood ? 1 : 0), 0),
    [expensesWithMood]
  );
  const totalMoodExpenses = useMemo(
    () => expensesWithMood.reduce((sum, t) => sum + Math.abs(t.amount), 0),
    [expensesWithMood]
  );

  // Calculate category breakdown by mood
  const categoryByMood = useMemo(() => {
    const result = {
      happy: {},
      neutral: {},
      sad: {}
    };
    expensesWithMood.forEach(expense => {
      const mood = expense.mood;
      const category = expense.category || 'uncategorized';
      if (mood && result[mood]) {
        if (!result[mood][category]) {
          result[mood][category] = { total: 0, count: 0 };
        }
        result[mood][category].total += Math.abs(expense.amount);
        result[mood][category].count += 1;
      }
    });
    return result;
  }, [expensesWithMood]);

  // Calculate time of day spending by mood
  const timeOfDayByMood = useMemo(() => {
    const result = {
      happy: { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 },
      neutral: { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 },
      sad: { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 }
    };
    expensesWithMood.forEach(expense => {
      const mood = expense.mood;
      const hour = getHourFromTime(expense.time);
      const timeOfDay = getTimeOfDay(hour);
      if (mood && result[mood]) {
        result[mood][timeOfDay] = (result[mood][timeOfDay] || 0) + 1;
      }
    });

    return result;
  }, [expensesWithMood]);

  // Calculate trend analysis (this week vs last week)
  const trendAnalysis = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);
    
    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setDate(thisWeekStart.getDate() - 1);
    lastWeekEnd.setHours(23, 59, 59, 999);

    const thisWeekExpenses = expensesWithMood.filter(expense => {
      const expenseDate = parseTransactionDate(expense.date);
      return expenseDate && expenseDate >= thisWeekStart && expenseDate <= today;
    });

    const lastWeekExpenses = expensesWithMood.filter(expense => {
      const expenseDate = parseTransactionDate(expense.date);
      return expenseDate && expenseDate >= lastWeekStart && expenseDate <= lastWeekEnd;
    });

    const thisWeekByMood = {
      happy: { count: 0, total: 0 },
      neutral: { count: 0, total: 0 },
      sad: { count: 0, total: 0 }
    };

    const lastWeekByMood = {
      happy: { count: 0, total: 0 },
      neutral: { count: 0, total: 0 },
      sad: { count: 0, total: 0 }
    };

    thisWeekExpenses.forEach(expense => {
      const mood = expense.mood;
      if (mood && thisWeekByMood[mood]) {
        thisWeekByMood[mood].count += 1;
        thisWeekByMood[mood].total += Math.abs(expense.amount);
      }
    });

    lastWeekExpenses.forEach(expense => {
      const mood = expense.mood;
      if (mood && lastWeekByMood[mood]) {
        lastWeekByMood[mood].count += 1;
        lastWeekByMood[mood].total += Math.abs(expense.amount);
      }
    });

    return { thisWeekByMood, lastWeekByMood };
  }, [expensesWithMood]);

  const [selectedMood, setSelectedMood] = useState(null);
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const formatCurrency = (value) =>
    value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Handle swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && generateInsights && currentInsightIndex < generateInsights.length - 1) {
      setCurrentInsightIndex(currentInsightIndex + 1);
    }
    if (isRightSwipe && currentInsightIndex > 0) {
      setCurrentInsightIndex(currentInsightIndex - 1);
    }
  };

  // Calculate overall spending patterns (not mood-specific)
  const overallCategoryAnalysis = useMemo(() => {
    const categoryTotals = {};
    expenses.forEach(expense => {
      const category = expense.category || 'uncategorized';
      if (!categoryTotals[category]) {
        categoryTotals[category] = { total: 0, count: 0 };
      }
      categoryTotals[category].total += Math.abs(expense.amount);
      categoryTotals[category].count += 1;
    });
    return categoryTotals;
  }, [expenses]);

  const overallTimeOfDayAnalysis = useMemo(() => {
    const timeTotals = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
    expenses.forEach(expense => {
      const hour = getHourFromTime(expense.time);
      const timeOfDay = getTimeOfDay(hour);
      if (timeOfDay !== 'Unknown') {
        timeTotals[timeOfDay] = (timeTotals[timeOfDay] || 0) + 1;
      }
    });
    return timeTotals;
  }, [expenses]);

  const overallDayOfWeekAnalysis = useMemo(() => {
    const dayTotals = {
      Sunday: { total: 0, count: 0 },
      Monday: { total: 0, count: 0 },
      Tuesday: { total: 0, count: 0 },
      Wednesday: { total: 0, count: 0 },
      Thursday: { total: 0, count: 0 },
      Friday: { total: 0, count: 0 },
      Saturday: { total: 0, count: 0 }
    };
    expenses.forEach(expense => {
      const expenseDate = parseTransactionDate(expense.date);
      if (expenseDate) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = dayNames[expenseDate.getDay()];
        if (dayTotals[dayName]) {
          dayTotals[dayName].total += Math.abs(expense.amount);
          dayTotals[dayName].count += 1;
        }
      }
    });
    return dayTotals;
  }, [expenses]);

  const overallTrendAnalysis = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);
    
    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setDate(thisWeekStart.getDate() - 1);
    lastWeekEnd.setHours(23, 59, 59, 999);

    const thisWeekTotal = expenses.filter(expense => {
      const expenseDate = parseTransactionDate(expense.date);
      return expenseDate && expenseDate >= thisWeekStart && expenseDate <= today;
    }).reduce((sum, e) => sum + Math.abs(e.amount), 0);

    const lastWeekTotal = expenses.filter(expense => {
      const expenseDate = parseTransactionDate(expense.date);
      return expenseDate && expenseDate >= lastWeekStart && expenseDate <= lastWeekEnd;
    }).reduce((sum, e) => sum + Math.abs(e.amount), 0);

    return { thisWeekTotal, lastWeekTotal };
  }, [expenses]);

  // Calculate average transaction amount
  const averageTransactionAmount = useMemo(() => {
    if (expenses.length === 0) return 0;
    const total = expenses.reduce((sum, e) => sum + Math.abs(e.amount), 0);
    return total / expenses.length;
  }, [expenses]);

  // Find highest and lowest spending days
  const spendingByDate = useMemo(() => {
    const dateTotals = {};
    expenses.forEach(expense => {
      const expenseDate = parseTransactionDate(expense.date);
      if (expenseDate) {
        const dateKey = expenseDate.toISOString().split('T')[0];
        if (!dateTotals[dateKey]) {
          dateTotals[dateKey] = 0;
        }
        dateTotals[dateKey] += Math.abs(expense.amount);
      }
    });
    return dateTotals;
  }, [expenses]);

  // Generate multiple insights based on analysis (changes daily based on date)
  const generateInsights = useMemo(() => {
    const today = new Date();
    const dayOfMonth = today.getDate(); // 1-31
    const month = today.getMonth(); // 0-11
    const year = today.getFullYear();
    
    // Use date to generate consistent but daily-changing seed
    const dateSeed = dayOfMonth + month * 31 + year * 365;
    
    // Helper function to decide if nickname should be used (30-40% chance)
    const shouldUseNickname = (index) => {
      if (!userNickname) return false;
      // Use nickname for about 30-40% of insights
      return (dateSeed + index) % 3 === 0 || (dateSeed + index) % 5 === 0;
    };
    
    // Helper function to format user reference
    const getUserRef = (index, possessive = false) => {
      if (shouldUseNickname(index)) {
        return possessive ? `${userNickname}'s` : userNickname;
      }
      return possessive ? 'your' : 'you';
    };

    // Fallback messages when data is limited
    const fallbackMessages = [
      "💡 Keep tracking your expenses! The more you record, the more insights you'll discover about your spending patterns.",
      "💡 As you add more transactions, you'll start seeing interesting patterns in your spending habits.",
      "💡 Tomorrow you'll see more insights as your spending data grows. Keep tracking!"
    ];

    if (expenses.length === 0) {
      // Return 3 fallback messages when no data
      const selectedFallbacks = [];
      for (let i = 0; i < 3; i++) {
        const fallbackIndex = (dateSeed + i * 11) % fallbackMessages.length;
        selectedFallbacks.push(fallbackMessages[fallbackIndex]);
      }
      return selectedFallbacks;
    }

    // Find highest and lowest average transaction amounts
    const averages = Object.entries(moodStats).map(([mood, stats]) => ({
      mood,
      average: stats.average,
      label: stats.label
    })).filter(m => m.average > 0);

    const sortedAverages = [...averages].sort((a, b) => b.average - a.average);
    const highestMood = sortedAverages.length > 0 ? sortedAverages[0] : null;
    const lowestMood = sortedAverages.length > 1 ? sortedAverages[sortedAverages.length - 1] : null;
    const diffPercentage = (highestMood && lowestMood && lowestMood.average > 0)
      ? Math.round(((highestMood.average - lowestMood.average) / lowestMood.average) * 100)
      : 0;

    // Find top category for each mood
    const topCategories = {};
    Object.keys(categoryByMood).forEach(mood => {
      const categories = Object.entries(categoryByMood[mood])
        .map(([cat, data]) => ({ category: cat, total: data.total, count: data.count }))
        .sort((a, b) => b.total - a.total);
      if (categories.length > 0) {
        topCategories[mood] = categories[0];
      }
    });

    // Find dominant time of day for each mood
    const dominantTimeOfDay = {};
    Object.keys(timeOfDayByMood).forEach(mood => {
      const times = Object.entries(timeOfDayByMood[mood])
        .filter(([time]) => time !== 'Unknown')
        .sort((a, b) => b[1] - a[1]);
      if (times.length > 0) {
        dominantTimeOfDay[mood] = times[0][0];
      }
    });

    // Calculate trend changes
    const trendChanges = {};
    Object.keys(trendAnalysis.thisWeekByMood).forEach(mood => {
      const thisWeek = trendAnalysis.thisWeekByMood[mood].total;
      const lastWeek = trendAnalysis.lastWeekByMood[mood].total;
      if (lastWeek > 0) {
        const change = ((thisWeek - lastWeek) / lastWeek) * 100;
        trendChanges[mood] = change;
      }
    });

    // Generate all possible insights (mood-based and general)
    const allInsights = [];
    let insightIndex = 0;
    
    // === MOOD-BASED INSIGHTS ===
    
    // Insight 1: Average transaction comparison (mood-based)
    if (totalMoodCount > 0 && averages.length >= 2 && highestMood && lowestMood) {
      const userRef = getUserRef(insightIndex, true);
      allInsights.push(
        `💡 When ${highestMood.label.toLowerCase()}, ${userRef} average transaction is $${formatCurrency(highestMood.average)} - the highest among all moods. That's ${diffPercentage}% more than when ${lowestMood.label.toLowerCase()} ($${formatCurrency(lowestMood.average)}).`
      );
      insightIndex++;
    }
    
    // Insight 2: Category analysis (mood-based)
    if (totalMoodCount > 0) {
      const topMood = Object.keys(topCategories).length > 0 
        ? Object.keys(topCategories).reduce((a, b) => 
            categoryByMood[a] && categoryByMood[b] 
              ? (Object.values(categoryByMood[a]).reduce((sum, d) => sum + (d.total || 0), 0) > 
                 Object.values(categoryByMood[b]).reduce((sum, d) => sum + (d.total || 0), 0) ? a : b)
              : a
          )
        : null;
      if (topMood && topCategories[topMood]) {
        const cat = topCategories[topMood];
        const moodLabel = moodStats[topMood]?.label || topMood;
        const userRef = getUserRef(insightIndex);
        allInsights.push(
          `💡 When ${moodLabel.toLowerCase()}, ${userRef} spend most in '${cat.category}' category ($${formatCurrency(cat.total)}, ${cat.count} transactions). Notice the connection between ${getUserRef(insightIndex, true)} emotions and spending categories.`
        );
        insightIndex++;
      }
    }
    
    // Insight 3: Time of day analysis (mood-based)
    if (totalMoodCount > 0) {
      const moodsWithTime = Object.keys(dominantTimeOfDay);
      if (moodsWithTime.length > 0) {
        const mood = moodsWithTime[0];
        const time = dominantTimeOfDay[mood];
        const moodLabel = moodStats[mood]?.label || mood;
        const timeLabel = time === 'Morning' ? 'morning' : time === 'Afternoon' ? 'afternoon' : time === 'Evening' ? 'evening' : 'night';
        const userRef = getUserRef(insightIndex);
        allInsights.push(
          `💡 When ${moodLabel.toLowerCase()}, ${userRef} tend to spend during the ${timeLabel}. Recognizing ${getUserRef(insightIndex, true)} emotional spending time patterns can help ${userRef} make more rational decisions.`
        );
        insightIndex++;
      }
    }
    
    // Insight 4: Trend analysis (mood-based)
    if (totalMoodCount > 0) {
      const significantTrends = Object.entries(trendChanges)
        .filter(([_, change]) => Math.abs(change) > 10)
        .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
      
      if (significantTrends.length > 0) {
        const [mood, change] = significantTrends[0];
        const moodLabel = moodStats[mood]?.label || mood;
        const direction = change > 0 ? 'increased' : 'decreased';
        const absChange = Math.abs(Math.round(change));
        const userRef = getUserRef(insightIndex, true);
        allInsights.push(
          `💡 ${userRef} ${moodLabel.toLowerCase()} spending this week ${direction} by ${absChange}% compared to last week. Notice the recent changes in ${getUserRef(insightIndex, true)} emotional spending patterns.`
        );
        insightIndex++;
      }
    }
    
    // === GENERAL SPENDING INSIGHTS (NOT MOOD-SPECIFIC) ===
    
    // Insight 5: Overall category analysis
    const sortedCategories = Object.entries(overallCategoryAnalysis)
      .map(([cat, data]) => ({ category: cat, total: data.total, count: data.count }))
      .sort((a, b) => b.total - a.total);
    if (sortedCategories.length > 0) {
      const topCategory = sortedCategories[0];
      const categoryPercentage = expenses.length > 0 
        ? Math.round((topCategory.count / expenses.length) * 100)
        : 0;
      const userRef = getUserRef(insightIndex, true);
      allInsights.push(
        `💡 ${userRef} top spending category is '${topCategory.category}' with $${formatCurrency(topCategory.total)} (${topCategory.count} transactions, ${categoryPercentage}% of all expenses). Consider if this aligns with ${getUserRef(insightIndex, true)} priorities.`
      );
      insightIndex++;
    }
    
    // Insight 6: Overall time of day analysis
    const sortedTimes = Object.entries(overallTimeOfDayAnalysis)
      .filter(([time]) => time !== 'Unknown')
      .sort((a, b) => b[1] - a[1]);
    if (sortedTimes.length > 0 && sortedTimes[0][1] > 0) {
      const topTime = sortedTimes[0];
      const timeLabel = topTime[0].toLowerCase();
      const timePercentage = expenses.length > 0 
        ? Math.round((topTime[1] / expenses.length) * 100)
        : 0;
      const userRef = getUserRef(insightIndex);
      allInsights.push(
        `💡 ${userRef} make ${timePercentage}% of ${getUserRef(insightIndex, true)} purchases during the ${timeLabel}. Being aware of ${getUserRef(insightIndex, true)} spending time patterns can help ${userRef} make more mindful decisions.`
      );
      insightIndex++;
    }
    
    // Insight 7: Day of week analysis
    const sortedDays = Object.entries(overallDayOfWeekAnalysis)
      .map(([day, data]) => ({ day, total: data.total, count: data.count, avg: data.count > 0 ? data.total / data.count : 0 }))
      .filter(d => d.count > 0)
      .sort((a, b) => b.avg - a.avg);
    if (sortedDays.length > 0) {
      const topDay = sortedDays[0];
      const userRef = getUserRef(insightIndex, true);
      allInsights.push(
        `💡 ${topDay.day} is ${userRef} highest spending day with an average of $${formatCurrency(topDay.avg)} per transaction. Plan ${getUserRef(insightIndex, true)} budget accordingly for this day.`
      );
      insightIndex++;
    }
    
    // Insight 8: Overall trend analysis
    if (overallTrendAnalysis.lastWeekTotal > 0) {
      const trendChange = ((overallTrendAnalysis.thisWeekTotal - overallTrendAnalysis.lastWeekTotal) / overallTrendAnalysis.lastWeekTotal) * 100;
      if (Math.abs(trendChange) > 10) {
        const direction = trendChange > 0 ? 'increased' : 'decreased';
        const absChange = Math.abs(Math.round(trendChange));
        const userRef = getUserRef(insightIndex, true);
        allInsights.push(
          `💡 ${userRef} spending this week ${direction} by ${absChange}% compared to last week ($${formatCurrency(overallTrendAnalysis.thisWeekTotal)} vs $${formatCurrency(overallTrendAnalysis.lastWeekTotal)}).`
        );
        insightIndex++;
      }
    }
    
    // Insight 9: Average transaction amount
    if (expenses.length > 0 && averageTransactionAmount > 0) {
      const userRef = getUserRef(insightIndex, true);
      allInsights.push(
        `💡 ${userRef} average transaction amount is $${formatCurrency(averageTransactionAmount)}. Tracking this helps ${getUserRef(insightIndex)} understand ${getUserRef(insightIndex, true)} typical spending patterns.`
      );
      insightIndex++;
    }
    
    // Insight 10: Highest spending day
    const dateEntries = Object.entries(spendingByDate);
    if (dateEntries.length > 0) {
      const sortedDates = dateEntries
        .map(([date, total]) => ({ date, total }))
        .sort((a, b) => b.total - a.total);
      const highestDay = sortedDates[0];
      const dateObj = new Date(highestDay.date);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const formattedDate = `${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}`;
      const userRef = getUserRef(insightIndex, true);
      allInsights.push(
        `💡 ${userRef} highest spending day was ${formattedDate} with $${formatCurrency(highestDay.total)}. Review what made that day different.`
      );
      insightIndex++;
    }

    // Filter out any empty or invalid insights
    const validInsights = allInsights.filter(insight => insight && insight.trim().length > 0);
    
    // If we have insights, select up to 3 based on date seed
    if (validInsights.length > 0) {
      // Use date seed to select which insights to show (consistent per day)
      const selectedIndices = new Set();
      const result = [];
      
      // First, add available insights (up to 3)
      let attempts = 0;
      while (result.length < 3 && attempts < validInsights.length * 2) {
        const index = (dateSeed + result.length * 7) % validInsights.length;
        if (!selectedIndices.has(index)) {
          selectedIndices.add(index);
          const insight = validInsights[index];
          if (insight && insight.trim().length > 0) {
            result.push(insight);
          }
        }
        attempts++;
      }
      
      // Fill remaining slots with fallback messages (always show 3)
      const usedFallbacks = new Set();
      while (result.length < 3) {
        const fallbackIndex = (dateSeed + result.length * 11) % fallbackMessages.length;
        let fallbackMessage = fallbackMessages[fallbackIndex];
        
        // If already used, find next available
        let attempts2 = 0;
        while (usedFallbacks.has(fallbackMessage) && attempts2 < fallbackMessages.length) {
          const nextIndex = (fallbackIndex + attempts2 + 1) % fallbackMessages.length;
          fallbackMessage = fallbackMessages[nextIndex];
          attempts2++;
        }
        
        if (!usedFallbacks.has(fallbackMessage)) {
          usedFallbacks.add(fallbackMessage);
          result.push(fallbackMessage);
        } else {
          result.push(fallbackMessages[0]);
        }
      }
      
      // Ensure we always return exactly 3 valid insights
      const finalResult = result.filter(insight => insight && insight.trim().length > 0);
      if (finalResult.length >= 1) {
        return finalResult.slice(0, 3);
      }
      return [fallbackMessages[0], fallbackMessages[1], fallbackMessages[2]];
    }

    // If no insights at all, return 3 fallback messages
    const selectedFallbacks = [];
    for (let i = 0; i < 3; i++) {
      const fallbackIndex = (dateSeed + i * 11) % fallbackMessages.length;
      selectedFallbacks.push(fallbackMessages[fallbackIndex]);
    }
    
    return selectedFallbacks;
  }, [
    moodStats, categoryByMood, timeOfDayByMood, trendAnalysis, totalMoodCount,
    overallCategoryAnalysis, overallTimeOfDayAnalysis, overallDayOfWeekAnalysis,
    overallTrendAnalysis, averageTransactionAmount, spendingByDate, expenses, userNickname
  ]);

  // Reset index when insights change
  useEffect(() => {
    setCurrentInsightIndex(0);
  }, [generateInsights]);

  const moodTransactions = useMemo(() => {
    if (!selectedMood) return [];
    return expensesWithMood.filter((t) => t.mood === selectedMood);
  }, [expensesWithMood, selectedMood]);

  return (
    <div className="p-6 pb-24 min-h-screen relative">
      <div className="mb-6">
        <div className="flex flex-col items-start gap-2 mb-2">
          <LoadingIcon size={28} strokeWidth={2} />
          <h1 className="text-2xl font-bold text-black">Mood Statistics</h1>
        </div>
        <p className="text-sm text-gray-500">
          Track how your spending habits align with your feelings.
        </p>
      </div>

      {/* Insight Messages (Swipeable) */}
      {(() => {
        const insights = generateInsights && Array.isArray(generateInsights) && generateInsights.length > 0 
          ? generateInsights 
          : ["💡 Keep tracking your expenses with moods! The more you record, the more insights you'll discover about your spending patterns."];
        
        return (
          <div className="mb-6 relative">
            <div className="relative bg-gray-50 rounded-[12px] border border-gray-200 overflow-hidden">
              {/* Left Arrow */}
              {insights.length > 1 && currentInsightIndex > 0 && (
                <button
                  onClick={() => setCurrentInsightIndex(currentInsightIndex - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors opacity-60 hover:opacity-100"
                  aria-label="Previous insight"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
              )}

              {/* Right Arrow */}
              {insights.length > 1 && currentInsightIndex < insights.length - 1 && (
                <button
                  onClick={() => setCurrentInsightIndex(currentInsightIndex + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors opacity-60 hover:opacity-100"
                  aria-label="Next insight"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              )}

              <div
                className="overflow-hidden relative"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div 
                  className="flex transition-transform duration-300 ease-out"
                  style={{ 
                    transform: `translateX(-${currentInsightIndex * (100 / insights.length)}%)`,
                    width: `${insights.length * 100}%`
                  }}
                >
                  {insights.map((insight, index) => {
                    const displayText = (insight && insight.trim().length > 0) 
                      ? insight 
                      : '💡 Keep tracking your expenses with moods! The more you record, the more insights you\'ll discover about your spending patterns.';
                    return (
                      <div
                        key={index}
                        className="flex-shrink-0 px-6 py-4"
                        style={{ width: `${100 / insights.length}%` }}
                      >
                        <p className="text-sm text-gray-800 leading-relaxed whitespace-normal break-words pr-2 pl-2">{displayText}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Dots indicator */}
              {insights.length > 1 && (
                <div className="flex justify-center gap-2 pb-4">
                  {insights.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentInsightIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentInsightIndex 
                          ? 'bg-[#F35DC8] w-6' 
                          : 'bg-gray-300 w-2'
                      }`}
                      aria-label={`Go to insight ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      <div className="space-y-4">
        {Object.entries(moodStats).map(([moodKey, stats]) => {
          const countPercentage =
            totalMoodCount > 0 ? Math.round((stats.count / totalMoodCount) * 100) : 0;
          const amountPercentage =
            totalMoodExpenses > 0 ? Math.round((stats.total / totalMoodExpenses) * 100) : 0;

          return (
            <div
              key={moodKey}
              className="bg-white rounded-[12px] p-5 shadow-sm border border-gray-100 cursor-pointer transition hover:shadow-md"
              onClick={() => setSelectedMood(moodKey)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{stats.emoji}</span>
                  <div>
                    <p className="text-lg font-semibold text-black">{stats.label}</p>
                    <p className="text-xs text-gray-500">{stats.count} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-black">${formatCurrency(stats.total)}</p>
                  <p className="text-xs text-gray-500">{amountPercentage}% of total</p>
                </div>
              </div>

              {/* 픽셀 스타일 progress bar */}
              <div className="w-full bg-gray-200 h-3 flex gap-0.5 overflow-hidden rounded-[4px]">
                {createPixelBlocks(countPercentage, 5).map((blockWidth, index) => (
                  <div
                    key={index}
                    className="h-full bg-[#F35DC8]"
                    style={{ width: `${blockWidth}%` }}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {totalMoodCount === 0 && (
          <div className="bg-white rounded-[12px] p-6 text-center border border-gray-100">
            <p className="text-sm text-gray-500">
              No mood data yet. Add moods to your expenses to see insights.
            </p>
          </div>
        )}
      </div>

      {selectedMood && (
        <>
          <div
            className="absolute inset-0 bg-black bg-opacity-40 z-[100]"
            onClick={() => setSelectedMood(null)}
          ></div>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[16px] p-6 z-[101] max-h-[85vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {selectedMood === 'happy' ? '🙂' : selectedMood === 'neutral' ? '😐' : '🫠'}
                </span>
                <h3 className="text-lg font-semibold text-black capitalize">
                  {selectedMood} expenses
                </h3>
              </div>
              <button
                onClick={() => setSelectedMood(null)}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M15 5L5 15M5 5L15 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {moodTransactions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No transactions found for this mood.
              </p>
            ) : (
              <div className="space-y-3">
                {moodTransactions.map((transaction) => (
                  <div key={transaction.id} className="bg-gray-50 rounded-[12px] p-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-black break-words">
                            {transaction.description || 'Untitled'}
                          </h4>
                          <span className="text-base flex-shrink-0">
                            {selectedMood === 'happy'
                              ? '🙂'
                              : selectedMood === 'neutral'
                              ? '😐'
                              : '🫠'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {(transaction.category || 'uncategorized')
                            .toString()
                            .replace(/^\w/, (c) => c.toUpperCase())}
                        </p>
                        {transaction.notes && (
                          <p className="text-xs text-gray-400 mt-2 italic break-words">
                            {transaction.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end flex-shrink-0">
                        <p className="text-sm font-bold text-black">
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {(transaction.time || '00:00')} {(transaction.date || 'Jan 1')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MoodPage;
