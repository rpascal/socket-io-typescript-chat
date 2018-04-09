const port: number = +(process.env.PORT) || 9000;

export const AppConfig: IAppConfig = {
  port: port,
  tables: {
    users: "users",
    conversation: "conversation",
    messages: "messages",
    messageType: "messageType"
  },
  secret: "SECRET"
};

interface IAppConfig {
  port: number;
  tables: ITables;
  secret: string;
}
interface ITables {
  users: string;
  conversation: string;
  messageType: string;
  messages: string;

}

