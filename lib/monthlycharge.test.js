import monthlyCharge, { daysInMonth } from "./monthlycharge";

const users = [
  {
    id: 1,
    name: "Employee #1",
    activatedOn: new Date("2020-12-01"),
    deactivatedOn: null,
    customerId: 1,
  },
  {
    id: 2,
    name: "Employee #2",
    activatedOn: new Date("2020-12-15"),
    deactivatedOn: null,
    customerId: 1,
  },
  {
    id: 3,
    name: "Employee #3",
    activatedOn: new Date("2021-02-15"),
    deactivatedOn: new Date("2021-03-28"),
    customerId: 1,
  },
];

const plan = {
  id: 1,
  customerId: 1,
  monthlyPriceInCents: 5000,
};

describe("daysInMonth", function () {
  it("should have 31 days in October 2018", function () {
    expect(daysInMonth(2018, 10)).toBe(31);
  });
});

describe("monthlyCharge", function () {
  it("should be 0 cents when no users are active for a month", function () {
    expect(monthlyCharge("2018-10", plan, users)).toBe(0);
  });

  it("should be 10000 cents when two users are active for the entire month", function () {
    expect(monthlyCharge("2021-01", plan, users)).toBe(10000);
  });

  it("should be 14355 cents when two users are active for the entire month and a third user is partially active until the 28th", function () {
    expect(monthlyCharge("2021-03", plan, users)).toBe(10000 + 4355);
  });
});
