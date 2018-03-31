const port: number = +(process.env.PORT) || 9000;

export const AppConfig: IAppConfig = {
  port: port,
  tables: {
    users: "users",
    conversation: "conversation",
    messages: "messages",
    messageType: "messageType"
  }
};

interface IAppConfig {
  port: number;
  tables: ITables;
}
interface ITables {
  users: string;
  conversation: string;
  messageType: string;
  messages: string;

}

