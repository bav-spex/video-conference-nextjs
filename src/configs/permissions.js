export const DEVICE_ACCESS_RULES = [
  {
    deviceType: "Android",
    family: 1,
    rule: [
      {
        module: "home",
        component: [
          {
            submodule: "dashboard",
            action: [
              "deviceInfo",
              "currentLocation",
              "subscription",
              "deviceStatus",
              "applicationUsage",
              "mostCallingContacts",
              "mostMessagingContacts",
              "mostViewedWebsite",
              "liveCapture",
            ],
          },
          {
            submodule: "timeline",
            action: [],
          },
          {
            submodule: "livepanel",
            action: [],
          },
          {
            submodule: "contacts",
            action: [],
          },
          {
            submodule: "remoteCommands",
            action: [],
          },
          {
            submodule: "antiTheft",
            action: [
              "antiTheftPhotoCaptureList",
              "antiTheftProtection",
              "photos",
            ],
          },
          // {
          //   submodule: "blockSite",
          //   action: [],
          // },
          {
            submodule: "screenTime",
            action: ["screenTime", "downTime"],
          },
          {
            submodule: "webFilter",
            action: [],
          },
          {
            submodule: "wifiHistory",
            action: [],
          },
          {
            submodule: "notifications",
            action: [],
          },
        ],
      },
      {
        module: "live",
        component: [
          {
            submodule: "schedule",
            action: ["schedule", "table", "noRecordFound"],
          },
          {
            submodule: "sdCard",
            action: ["fileExplorerAccess", "directory", "retry"],
          },
          {
            submodule: "location",
            action: ["allLocationHistory", "gpsLocation", "locationHistory"],
          },
        ],
      },
      {
        module: "apps",
        component: [
          {
            submodule: "apps",
            action: ["installedPackages"],
          },
          {
            submodule: "instantIM",
            action: [],
          },
          {
            submodule: "appUsage",
            action: ["graph", "appUsage"],
          },
          {
            submodule: "appsRecording",
            action: ["screen"],
          },
        ],
      },
      {
        module: "system",
        component: [
          {
            submodule: "textCommand",
            action: [],
          },
          {
            submodule: "health",
            action: [],
          },
          {
            submodule: "uninstallT",
            action: [],
          },
          {
            submodule: "subscription",
            action: [],
          },
        ],
      },
      {
        module: "utilities",
        component: [
          {
            submodule: "settings",
            action: [],
          },
          {
            submodule: "transfer",
            action: [],
          },
          {
            submodule: "changePassword",
            action: [],
          },
          {
            submodule: "dataManagement",
            action: [],
          },
          {
            submodule: "systemLogEvents",
            action: [],
          },
        ],
      },
    ],
  },
  {
    deviceType: "IOS",
    family: 9,
    rule: [
      {
        module: "home",
        component: [
          {
            submodule: "dashboard",
            action: [
              "deviceInfo",
              "currentLocation",
              "subscription",
              "deviceStatus",
              "applicationUsage",
              "mostCallingContacts",
              "mostMessagingContacts",
              "mostViewedWebsite",
              "liveCapture",
            ],
          },

          {
            submodule: "contacts",
            action: [],
          },
          {
            submodule: "apps",
            action: ["installedPackages"],
          },
          {
            submodule: "instantIM",
            action: [],
          },
          {
            submodule: "appUsage",
            action: ["graph", "appUsage"],
          },
          {
            submodule: "whatsappWeb",
            action: [],
          },
        ],
      },
      {
        module: "utilities",
        component: [
          {
            submodule: "settings",
            action: [],
          },
          {
            submodule: "transfer",
            action: [],
          },
          {
            submodule: "changePassword",
            action: [],
          },
          {
            submodule: "dataManagement",
            action: [],
          },
          {
            submodule: "systemLogEvents",
            action: [],
          },
        ],
      },
    ],
  },
  {
    deviceType: "Windows",
    family: 7,
    rule: [
      {
        module: "home",
        component: [
          {
            submodule: "dashboard",
            action: [
              "deviceInfo",
              "currentLocation",
              "subscription",
              "deviceStatus",
              "applicationUsage",
              "mostCallingContacts",
              "mostMessagingContacts",
              "mostViewedWebsite",
              "liveCapture",
            ],
          },
          {
            submodule: "timeline",
            action: [],
          },
          {
            submodule: "livepanel",
            action: [],
          },
          {
            submodule: "facebook",
            action: [],
          },
          {
            submodule: "directory",
            action: [],
          },
          {
            submodule: "keylogger",
            action: [],
          },
          {
            submodule: "clipboard",
            action: [],
          },
          {
            submodule: "photos",
            action: [],
          },
          {
            submodule: "webhistory",
            action: [],
          },

          {
            submodule: "blockSite",
            action: [],
          },
          {
            submodule: "monitoringwebsite",
            action: [],
          },
          {
            submodule: "schedule",
            action: ["schedule", "table", "noRecordFound"],
          },
          {
            submodule: "apps",
            action: ["installedPackages"],
          },
          {
            submodule: "appUsage",
            action: ["graph", "appUsage"],
          },
          {
            submodule: "appsRecording",
            action: ["screen"],
          },
          {
            submodule: "uninstallT",
            action: [],
          },
          {
            submodule: "subscription",
            action: [],
          },
        ],
      },
      // {
      //   module: "live",
      //   component: [
      //     {
      //       submodule: "schedule",
      //       action: ["schedule", "table", "noRecordFound"],
      //     },
      //     {
      //       submodule: "sdCard",
      //       action: ["fileExplorerAccess", "directory", "retry"],
      //     },
      //     {
      //       submodule: "location",
      //       action: ["allLocationHistory", "gpsLocation", "locationHistory"],
      //     },
      //   ],
      // },
      // {
      //   module: "apps",
      //   component: [
      //     {
      //       submodule: "apps",
      //       action: ["installedPackages"],
      //     },
      //     {
      //       submodule: "instantIM",
      //       action: [],
      //     },
      //     {
      //       submodule: "appUsage",
      //       action: ["graph", "appUsage"],
      //     },
      //     {
      //       submodule: "appsRecording",
      //       action: ["screen"],
      //     },
      //   ],
      // },
      // {
      //   module: "system",
      //   component: [
      //     {
      //       submodule: "textCommand",
      //       action: [],
      //     },
      //     {
      //       submodule: "health",
      //       action: [],
      //     },
      //     {
      //       submodule: "uninstallT",
      //       action: [],
      //     },
      //     {
      //       submodule: "subscription",
      //       action: [],
      //     },
      //   ],
      // },
      {
        module: "utilities",
        component: [
          {
            submodule: "settings",
            action: [],
          },
          {
            submodule: "transfer",
            action: [],
          },
          {
            submodule: "changePassword",
            action: [],
          },
          {
            submodule: "dataManagement",
            action: [],
          },
          {
            submodule: "systemLogEvents",
            action: [],
          },
        ],
      },
    ],
  },
  {
    deviceType: "macOS",
    family: 11,
    rule: [
      {
        module: "home",
        component: [
          {
            submodule: "dashboard",
            action: [
              "deviceInfo",
              "currentLocation",
              "subscription",
              "deviceStatus",
              "applicationUsage",
              "mostCallingContacts",
              "mostMessagingContacts",
              "mostViewedWebsite",
              "liveCapture",
            ],
          },
          {
            submodule: "timeline",
            action: [],
          },
          {
            submodule: "livepanel",
            action: [],
          },
          {
            submodule: "directory",
            action: [],
          },
          {
            submodule: "keylogger",
            action: [],
          },
          {
            submodule: "clipboard",
            action: [],
          },
          {
            submodule: "photos",
            action: [],
          },
          {
            submodule: "webhistory",
            action: [],
          },
          {
            submodule: "blockSite",
            action: [],
          },
          {
            submodule: "monitoringwebsite",
            action: [],
          },
          {
            submodule: "schedule",
            action: ["schedule", "table", "noRecordFound"],
          },
          {
            submodule: "apps",
            action: ["installedPackages"],
          },
          {
            submodule: "appUsage",
            action: ["graph", "appUsage"],
          },
          {
            submodule: "appsRecording",
            action: ["screen"],
          },
          {
            submodule: "uninstallT",
            action: [],
          },
          {
            submodule: "subscription",
            action: [],
          },
        ],
      },
      // {
      //   module: "live",
      //   component: [
      //     {
      //       submodule: "schedule",
      //       action: ["schedule", "table", "noRecordFound"],
      //     },
      //     {
      //       submodule: "sdCard",
      //       action: ["fileExplorerAccess", "directory", "retry"],
      //     },
      //     {
      //       submodule: "location",
      //       action: ["allLocationHistory", "gpsLocation", "locationHistory"],
      //     },
      //   ],
      // },
     /*  {
        module: "apps",
        component: [       
          {
            submodule: "instantIM",
            action: [],
          },
        ],
      },
      {
        module: "system",
        component: [
          {
            submodule: "textCommand",
            action: [],
          },
          {
            submodule: "health",
            action: [],
          },
        ],
      }, */
      {
        module: "utilities",
        component: [
          {
            submodule: "settings",
            action: [],
          },
          {
            submodule: "transfer",
            action: [],
          },
          {
            submodule: "changePassword",
            action: [],
          },
          {
            submodule: "dataManagement",
            action: [],
          },
          {
            submodule: "systemLogEvents",
            action: [],
          },
        ],
      },
    ],
  },
  {
    deviceType: "WhatsAppWeb",
    family: 12,
    rule: [
      {
        module: "home",
        component: [
          {
            submodule: "whatsappWebChat",
            action: [],
          },
          {
            submodule: "dataManagement",
            action: [],
          },
          {
            submodule: "subscription",
            action: [],
          },
          {
            submodule: "changePassword",
            action: [],
          },
          {
            submodule: "reInstallQRCode",
            action: [],
          },
        ],
      },
    ],
  },
];
