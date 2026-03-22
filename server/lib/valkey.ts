import Valkey from "iovalkey";

let client: any;

export function initValkey() {
  if (!client) {
    client = new Valkey({
      host: process.env.VALKEY_HOST!,
      port: Number(process.env.VALKEY_PORT) || 6379,
      password: process.env.VALKEY_PASSWORD || undefined,
    });

    client.on("connect", () => {
      console.log("Valkey connected via iovalkey");
    });
  }

  return client;
}

export const valkey = initValkey();
