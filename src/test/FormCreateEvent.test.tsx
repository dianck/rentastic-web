// __tests__/FormCreateEvent.test.tsx
import { screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "@/lib/axios";

// Mock axios
jest.mock("@/lib/axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("FormCreateEvent", () => {
//   const organizerId = "org-123";

  const locationsMock = [
    { id: 1, name: "Location A" },
    { id: 2, name: "Location B" },
  ];

  const categoriesMock = [
    { id: 1, name: "Category A" },
    { id: 2, name: "Category B" },
  ];

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock GET /locations and /categories
    mockedAxios.get.mockImplementation((url) => {
      if (url === "/locations") {
        return Promise.resolve({ data: locationsMock });
      }
      if (url === "/categories") {
        return Promise.resolve({ data: categoriesMock });
      }
      return Promise.reject(new Error("not found"));
    });
  });

  test("renders form and loads locations and categories", async () => {
    // render(<FormCreateEvent organizerId={organizerId} />);
    
    // Wait for locations & categories to load (useEffect)
    await waitFor(() => {
      expect(screen.getByText("Location A")).toBeInTheDocument();
      expect(screen.getByText("Category B")).toBeInTheDocument();
    });
  });

  test("shows validation errors on empty submit", async () => {
    // render(<FormCreateEvent organizerId={organizerId} />);
    
    await waitFor(() => screen.getByText("Create New Event"));
    
    // Submit form without filling inputs
    fireEvent.click(screen.getByRole("button", { name: /create event/i }));
    
    // Wait for validation errors to appear
    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
      expect(screen.getByText("Description is required")).toBeInTheDocument();
      expect(screen.getByText("Please select a valid location")).toBeInTheDocument();
      expect(screen.getByText("Start date is required")).toBeInTheDocument();
      expect(screen.getByText("End date is required")).toBeInTheDocument();
      expect(screen.getByText("Total seats must be greater than 0")).toBeInTheDocument();
      expect(screen.getByText("Please select a valid category")).toBeInTheDocument();
      expect(screen.getByText("Price is required")).toBeInTheDocument();
    });
  });

  test("price field shows only when isPaid=true", async () => {
    // render(<FormCreateEvent organizerId={organizerId} />);

    await waitFor(() => screen.getByText("Create New Event"));

    // Initially isPaid = true, price input should be visible
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();

    // Change isPaid to Free (false)
    userEvent.selectOptions(screen.getByLabelText(/is paid/i), "false");

    // Price input should be hidden now
    expect(screen.queryByLabelText(/price/i)).not.toBeInTheDocument();

    // Change back to Paid (true)
    userEvent.selectOptions(screen.getByLabelText(/is paid/i), "true");

    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
  });

  test("submits form successfully with valid data", async () => {
    // render(<FormCreateEvent organizerId={organizerId} />);

    await waitFor(() => screen.getByText("Create New Event"));

    // Fill inputs with valid data
    userEvent.type(screen.getByLabelText(/title/i), "Test Event");
    userEvent.type(screen.getByLabelText(/description/i), "Test Description");

    userEvent.selectOptions(screen.getByLabelText(/location/i), "1");

    userEvent.type(screen.getByLabelText(/start date/i), "2025-06-07T10:00");
    userEvent.type(screen.getByLabelText(/end date/i), "2025-06-07T12:00");

    userEvent.type(screen.getByLabelText(/total seats/i), "50");
    userEvent.selectOptions(screen.getByLabelText(/category/i), "2");
    userEvent.selectOptions(screen.getByLabelText(/is paid/i), "true");
    userEvent.type(screen.getByLabelText(/^price$/i), "100");

    // Fill ticket type fields (first ticket)
    userEvent.type(screen.getByLabelText("Name"), "VIP");
    userEvent.clear(screen.getByLabelText("Price"));
    userEvent.type(screen.getByLabelText("Price"), "150");
    userEvent.clear(screen.getByLabelText("Quota"));
    userEvent.type(screen.getByLabelText("Quota"), "10");

    // Mock post
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /create event/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith("/event", expect.any(Object));
    });
  });
});
