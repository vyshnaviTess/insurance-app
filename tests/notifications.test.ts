import * as Notifications from "expo-notifications";
import { scheduleLocal } from "../src/services/notifications";

jest.mock("expo-notifications");

describe("notifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("schedules a notification with correct params", async () => {
    // Mock granted permissions
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });

    // Mock scheduled notification ID
    (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
      "notif-1"
    );

    const date = new Date("2030-01-01T10:00:00Z");
    const id = await scheduleLocal("Test Title", "Test Body", date);

    expect(id).toBe("notif-1");

    // ✅ Check that scheduleNotificationAsync was called with correct data
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: {
        title: "Test Title",
        body: "Test Body",
        sound: "default",
      },
      trigger: {
       type: "date", // ✅ include this
       date: new Date("2030-01-01T10:00:00.000Z"),
    },
    });
  });
});
