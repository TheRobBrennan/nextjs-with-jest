export function daysInMonth(year, month) {
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
  const dailyRateInCents = Math.floor(
    subscription.monthlyPriceInCents / daysInMonthCount
  );

  let runningTotalInCents = 0;
  let activeUsersForEntireMonth = 0; // Track the number of active users billed for the entire month

  if (users && users.length > 0) {
    users.forEach((user) => {
      if (user.customerId === subscription.customerId) {
        const userStartDate = new Date(user.activatedOn);
        const userEndDate = user.deactivatedOn
          ? new Date(user.deactivatedOn)
          : new Date(yearInt, monthInt, daysInMonthCount);

        const startOfMonth = new Date(yearInt, monthInt - 1, 1);
        const endOfMonth = new Date(yearInt, monthInt, 0);

        const userActivatedInMonth =
          userStartDate <= startOfMonth && userEndDate >= startOfMonth;
        const userDeactivatedInMonth =
          userEndDate >= endOfMonth && userStartDate <= endOfMonth;

        if (userActivatedInMonth && userDeactivatedInMonth) {
          // User is active for the entire month
          activeUsersForEntireMonth++;
        } else if (userActivatedInMonth) {
          // User is active for a partial month (activated during the month)
          const activeDaysInMonth =
            daysInMonthCount - userStartDate.getDate() + 1;
          runningTotalInCents += dailyRateInCents * activeDaysInMonth;
        } else if (userDeactivatedInMonth) {
          // User is active for a partial month (deactivated during the month)
          const activeDaysInMonth = userEndDate.getDate();
          runningTotalInCents += dailyRateInCents * activeDaysInMonth;
        }
      } else {
        console.log(`userId: ${user.id} not processed`);
      }
    });
  }

  runningTotalInCents +=
    subscription.monthlyPriceInCents * activeUsersForEntireMonth; // Multiply by the count of active users billed for the entire month

  return runningTotalInCents;
}
