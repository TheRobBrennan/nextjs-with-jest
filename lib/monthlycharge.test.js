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
  it("works when no users are active", function () {
    expect(monthlyCharge("2018-10", plan, users)).toBe(0);
  });

  it("works when the users are active the entire month", function () {
    expect(monthlyCharge("2021-01", plan, users)).toBe(10000);
  });
});
