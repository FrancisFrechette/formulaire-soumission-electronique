
export const sendConfirmationEmail = async (email: string, submissionId: string): Promise<void> => {
  console.log(`Simulation de l'envoi d'un courriel à ${email} for submission ${submissionId}`);
  // In a real application, this would be an API call to a backend service.
  // Example:
  // await fetch('/api/send-email', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ to: email, submissionId }),
  // });
  return new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
};
