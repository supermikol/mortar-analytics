var calculateDataSums = function(data){
  var revenueData = data[0];
  var expenseData = data[1];

  var profitDataHash = {
    "key": "Profits",
    "values": []
  }

  var expenseDataHash = {
    "key": "Expenses",
    "values": []
  }

  var revenueDataHash = {
    "key": "Revenues",
    "values": []
  }

  var TIME_TO_NEXT_DAY = 86400000;

  // Expenses Sum
  for (var i = 0; i < expenseData.length; i++) {
    if (i === 0 ) {
      expenseDataHash.values.push([new Date(expenseData[0].date).getTime() + new Date(expenseData[0].date).getTimezoneOffset() * 60000, expenseData[0].sum]);
    } else {
      var previousDate = expenseDataHash.values[expenseDataHash.values.length - 1][0]
      var nextDataDate = new Date(expenseData[i].date).getTime() + new Date(expenseData[i].date).getTimezoneOffset() * 60000;

      while ((previousDate += TIME_TO_NEXT_DAY) !== nextDataDate) {
        expenseDataHash.values.push([previousDate, expenseDataHash.values[i-1][1]]);
      }

      expenseDataHash.values.push([nextDataDate, expenseDataHash.values[expenseDataHash.values.length - 1][1] + expenseData[i].sum])
    }
  }

  // Revenues Sum
  for (var i = 0; i < revenueData.length; i++) {
    if (i === 0 ) {
      revenueDataHash.values.push([new Date(revenueData[0].date).getTime() + new Date(revenueData[0].date).getTimezoneOffset() * 60000, revenueData[0].sum]);
    } else {
      var previousDate = revenueDataHash.values[revenueDataHash.values.length - 1][0]
      var nextDataDate = new Date(revenueData[i].date).getTime() + new Date(revenueData[i].date).getTimezoneOffset() * 60000;

      while ((previousDate += TIME_TO_NEXT_DAY) !== nextDataDate) {
        revenueDataHash.values.push([previousDate, revenueDataHash.values[revenueDataHash.values.length - 1][1]]);
      }

      revenueDataHash.values.push([nextDataDate, revenueDataHash.values[revenueDataHash.values.length - 1][1] + revenueData[i].sum])
    }
  }

  // Filling in missing date ends for revenue and expenses
  var firstRevenueDate = revenueDataHash.values[0][0];
  var firstExpenseDate = expenseDataHash.values[0][0];
  var lastRevenueDate = revenueDataHash.values[revenueDataHash.values.length - 1][0];
  var lastExpenseDate = expenseDataHash.values[expenseDataHash.values.length - 1][0];

  // Set missing end dates
  if (lastRevenueDate > lastExpenseDate) {
    while (lastRevenueDate > lastExpenseDate) {
      expenseDataHash.values.push([lastExpenseDate += TIME_TO_NEXT_DAY, expenseDataHash.values[expenseDataHash.values.length - 1][1]]);
    }
  } else if (lastExpenseDate > lastRevenueDate) {
    while (lastExpenseDate > lastRevenueDate) {
      revenueDataHash.values.push([lastRevenueDate += TIME_TO_NEXT_DAY, revenueDataHash.values[revenueDataHash.values.length - 1][1]]);
    }
  }

  // Set missing date starts with values of 0
  if (firstRevenueDate < firstExpenseDate) {
    while (firstRevenueDate < firstExpenseDate) {
      expenseDataHash.values.unshift([firstExpenseDate -= TIME_TO_NEXT_DAY, 0]);
    }
  } else if (firstExpenseDate < firstRevenueDate) {
    while (firstExpenseDate < firstRevenueDate) {
      revenueDataHash.values.unshift([firstRevenueDate -= TIME_TO_NEXT_DAY, 0]);
    }
  }

  // Calculate sum of profits per day
  for (var i = 0; i < revenueDataHash.values.length; i++) {
    profitDataHash.values.push([revenueDataHash.values[i][0], revenueDataHash.values[i][1] - expenseDataHash.values[i][1]])
  }

  return { "expenseDataHash": expenseDataHash, "profitDataHash": profitDataHash, "revenueDataHash": revenueDataHash };
}
