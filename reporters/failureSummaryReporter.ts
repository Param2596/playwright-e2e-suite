import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { summarizeFailure } from '../ai/summarizeFailure';

class FailureSummaryReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status !== 'failed' && result.status !== 'timedOut') return;

    const log = result.errors.map((error) => error.message ?? '').join('\n');
    const { cause, nextStep } = summarizeFailure(log);

    console.log(test.title);
    console.log(`cause: ${cause}`);
    console.log(`nextStep: ${nextStep}`);
  }
}

export default FailureSummaryReporter;