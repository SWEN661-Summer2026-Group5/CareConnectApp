// PatientService.js (Your logic)
export class PatientController {
  constructor(apiService) {
    this.apiService = apiService;
    this.patients = [];
    this.isLoading = false;
  }

  async loadPatients() {
    this.isLoading = true;
    try {
      this.patients = await this.apiService.fetchPatientData();
    } catch (e) {
      this.patients = [];
    } finally {
      this.isLoading = false;
    }
  }
}

// PatientController.test.js (Your test)


describe('PatientController Mocking Tests', () => {
  let mockApiService;
  let patientController;

  beforeEach(() => {
    // Jest way of creating a mock: we define the method we want to fake
    mockApiService = {
      fetchPatientData: jest.fn(),
    };
    patientController = new PatientController(mockApiService);
  });

  test('Should successfully load patient data and update state', async () => {
    // Arrange: Setup the return value for the mock
    const samplePatients = [
      { id: '1', name: 'John Doe', condition: 'Parkinson Tremor Stage 1' },
      { id: '2', name: 'Jane Smith', condition: 'Cognitive Exercises' },
    ];
    
    // Equivalent to 'when(...).thenAnswer(...)'
    mockApiService.fetchPatientData.mockResolvedValue(samplePatients);

    // Act
    await patientController.loadPatients();

    // Assert
    expect(patientController.isLoading).toBe(false);
    expect(patientController.patients.length).toBe(2);
    expect(patientController.patients[0].name).toBe('John Doe');

    // Verify: Equivalent to 'verify(...).called(1)'
    expect(mockApiService.fetchPatientData).toHaveBeenCalledTimes(1);
  });

  test('Should handle network exceptions gracefully', async () => {
    // Arrange: Tell the mock to reject/throw an error
    mockApiService.fetchPatientData.mockRejectedValue(new Error('500 Error'));

    // Act
    await patientController.loadPatients();

    // Assert
    expect(patientController.isLoading).toBe(false);
    expect(patientController.patients).toEqual([]);
  });
});