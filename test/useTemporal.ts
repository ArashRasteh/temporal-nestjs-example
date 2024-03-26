import { TestWorkflowEnvironment } from '@temporalio/testing';

let testEnv: TestWorkflowEnvironment;

export const getTemporalEnv = async () => {
  if (testEnv) {
    return testEnv;
  }

  testEnv = await TestWorkflowEnvironment.createLocal();

  return testEnv;
};
