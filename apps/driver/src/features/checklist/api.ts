import type {
  DriverChecklistReceipt,
  DriverChecklistSubmission,
  DriverChecklistTemplate,
} from "@rookhub/types";

import { mockChecklistTemplate, mockSubmitChecklist } from "@/mocks/checklist";

export function getTemplate(): Promise<DriverChecklistTemplate> {
  return mockChecklistTemplate();
}

export function submitChecklist(
  submission: DriverChecklistSubmission,
): Promise<DriverChecklistReceipt> {
  return mockSubmitChecklist(submission);
}
