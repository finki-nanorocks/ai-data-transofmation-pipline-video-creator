const logger = (message, isError = false) => {
  console.log(`\n ${isError ? 'Error in pipeline' : 'Logger'}: ${message}`);
};

export default logger;