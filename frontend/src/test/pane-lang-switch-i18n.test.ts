import { describe, expect, it } from "vitest";

import { translate } from "@/lib/i18n/translations";

describe("pane destination language switcher", () => {
  it("uses a destination-language label on the pane switcher", () => {
    expect(translate("en-US", "app.langSwitch")).toBe("မြန်မာ");
    expect(translate("my-MM", "app.langSwitch")).toBe("EN");
    expect(translate("en-US", "app.langSwitchAria")).toBe("Switch to Myanmar");
    expect(translate("my-MM", "app.langSwitchAria")).toBe("Switch to English");
  });
});
