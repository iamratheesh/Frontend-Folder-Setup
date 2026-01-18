import configureStore from "./configureStore";

const { store, persister } = configureStore();

export { store, persister };
