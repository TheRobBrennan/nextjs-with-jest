// monthlycharge.js

export function daysInMonth(year, month) {
  // Get the last day of the current month (month + 1)
  return new Date(year, month, 0).getDate();
}

export default function monthlyCharge(month, subscription, users) {
  const [year, m] = month.split("-");
  const yearInt = parseInt(year);
  const monthInt = parseInt(m);

  if (isNaN(yearInt) || isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
    throw new Error("Invalid month format. Please use YYYY-MM format.");
  }

  const daysInMonthCount = daysInMonth(yearInt, monthInt);

  let runningTotalInCents = 0;

  if (users && users.length > 0) {
    users.forEach((user) => {
      const { activatedOn, deactivatedOn } = user;

      if (
        user.customerId === subscription.customerId &&
        activatedOn <= new Date(yearInt, monthInt, 0) && // User activated on or before the last day of the month
        (!deactivatedOn || deactivatedOn >= new Date(yearInt, monthInt - 1, 1)) // User deactivated on or after the first day of the month
      ) {
        if (!deactivatedOn) {
          // User is active for the entire month
          runningTotalInCents += subscription.monthlyPriceInCents;
        } else {
          // User is partially active during the month
          const firstDayOfMonth = new Date(yearInt, monthInt - 1, 1);
          const daysActiveInMonth = Math.min(
            daysInMonthCount,
            1 +
              Math.floor(
                (deactivatedOn - firstDayOfMonth) / (1000 * 60 * 60 * 24)
              ) // Include the end date in the count
          );

          // Calculate the partial charge based on the number of days the user was active
          const partialCharge =
            (subscription.monthlyPriceInCents * daysActiveInMonth) /
            daysInMonthCount;
          runningTotalInCents += partialCharge;
        }
      }
    });
  }

  return Math.round(runningTotalInCents); // Round the total to handle floating-point precision errors
}
