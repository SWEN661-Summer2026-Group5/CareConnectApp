import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

// --- 1. THE REAL CLASSES (What your app actually uses) ---

class PatientRecord {
  final String id;
  final String name;
  final String condition;

  PatientRecord({required this.id, required this.name, required this.condition});
}

/// The service that connects to the internet to get data
class ApiService {
  Future<List<PatientRecord>> fetchPatientData() async {
    // In production, this would make an actual HTTP web network call.
    // During tests, we want to intercept this so we don't hit the internet.
    throw UnimplementedError('Real network connection not available in tests!');
  }
}

/// The state controller that depends on the ApiService
class PatientController {
  final ApiService apiService;
  List<PatientRecord> patients = [];
  bool isLoading = false;

  PatientController({required this.apiService});

  Future<void> loadPatients() async {
    isLoading = true;
    try {
      patients = await apiService.fetchPatientData();
    } catch (e) {
      patients = [];
    } finally {
      isLoading = false;
    }
  }
}

// --- 2. THE MOCK CLASS (The fake double for testing) ---

/// By extending Mock and implementing ApiService, Mocktail creates a 
/// blank canvas that allows us to explicitly program its responses.
class MockApiService extends Mock implements ApiService {}

// --- 3. THE MEANINGFUL TEST SUITE ---

void main() {
  late MockApiService mockApiService;
  late PatientController patientController;

  // Runs automatically before every single test block
  setUp(() {
    mockApiService = MockApiService();
    // Inject the mock service into the controller instead of the real one
    patientController = PatientController(apiService: mockApiService);
  });

  test('Should successfully load patient data and update state parameters', () async {
    // Arrange: Set up mock data to return when the fake service is called
    final samplePatients = [
      PatientRecord(id: '1', name: 'John Doe', condition: 'Parkinson Tremor Stage 1'),
      PatientRecord(id: '2', name: 'Jane Smith', condition: 'Cognitive Exercises'),
    ];

    // Tell Mocktail: "When anyone calls fetchPatientData(), do not hit the web. 
    // Intercept it immediately and return our safe sample data instead."
    when(() => mockApiService.fetchPatientData())
        .thenAnswer((_) async => samplePatients);

    // Act: Trigger the business logic function
    await patientController.loadPatients();

    // Assert: Verify that the controller successfully processed the mock data
    expect(patientController.isLoading, false);
    expect(patientController.patients.length, 2);
    expect(patientController.patients.first.name, 'John Doe');

    // Verify: Ensure the controller actually called the API method exactly once
    verify(() => mockApiService.fetchPatientData()).called(1);
  });

  test('Should handle network exceptions gracefully and clear patient list', () async {
    // Arrange: Tell Mocktail to deliberately simulate a server crash/timeout
    when(() => mockApiService.fetchPatientData())
        .thenThrow(Exception('500 Internal Server Error'));

    // Act: Trigger the logic
    await patientController.loadPatients();

    // Assert: Verify the app didn't crash, but handled the failure safely
    expect(patientController.isLoading, false);
    expect(patientController.patients, isEmpty);
  });
}