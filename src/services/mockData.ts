
import { User, Course, Complaint, Message } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

// Demo users for the system
const initialUsers: User[] = [
  {
    id: "s1",
    name: "John Doe",
    email: "john@university.edu",
    role: "student",
    courses: ["cs101", "math201", "eng110"]
  },
  {
    id: "s2",
    name: "Jane Smith",
    email: "jane@university.edu",
    role: "student",
    courses: ["cs101", "cs202", "bio101"]
  },
  {
    id: "s3",
    name: "Alex Johnson",
    email: "alex@university.edu",
    role: "student",
    courses: ["cs202", "phy101", "chem101", "math201"]
  },
  {
    id: "s4",
    name: "Sarah Williams",
    email: "sarah@university.edu",
    role: "student",
    courses: ["bio101", "chem101", "hist101", "art101"]
  },
  {
    id: "s5",
    name: "Michael Chen",
    email: "michael@university.edu",
    role: "student",
    courses: ["eng110", "hist101", "art101", "phy101"]
  },
  {
    id: "l1",
    name: "Dr. Robert Brown",
    email: "rbrown@university.edu",
    role: "lecturer",
    courses: ["cs101", "cs202"]
  },
  {
    id: "l2",
    name: "Prof. Emily White",
    email: "ewhite@university.edu",
    role: "lecturer",
    courses: ["math201", "eng110"]
  },
  {
    id: "l3",
    name: "Dr. James Smith",
    email: "jsmith@university.edu",
    role: "lecturer",
    courses: ["bio101", "chem101"]
  },
  {
    id: "l4",
    name: "Prof. Lisa Chen",
    email: "lchen@university.edu",
    role: "lecturer",
    courses: ["hist101", "art101", "phy101"]
  }
];

// Available courses
const initialCourses: Course[] = [
  {
    id: "cs101",
    code: "CS101",
    name: "Introduction to Computer Science",
    lecturerId: "l1"
  },
  {
    id: "cs202",
    code: "CS202",
    name: "Data Structures and Algorithms",
    lecturerId: "l1"
  },
  {
    id: "math201",
    code: "MATH201",
    name: "Calculus II",
    lecturerId: "l2"
  },
  {
    id: "eng110",
    code: "ENG110",
    name: "Academic Writing",
    lecturerId: "l2"
  },
  {
    id: "bio101",
    code: "BIO101",
    name: "Introduction to Biology",
    lecturerId: "l3"
  },
  {
    id: "chem101",
    code: "CHEM101",
    name: "General Chemistry",
    lecturerId: "l3"
  },
  {
    id: "phy101",
    code: "PHY101",
    name: "Physics for Scientists",
    lecturerId: "l4"
  },
  {
    id: "hist101",
    code: "HIST101",
    name: "World History",
    lecturerId: "l4"
  },
  {
    id: "art101",
    code: "ART101",
    name: "Introduction to Fine Arts",
    lecturerId: "l4"
  }
];

// Sample complaints data
const initialComplaints: Complaint[] = [
  {
    id: uuidv4(),
    referenceNumber: "COMP-2023-001",
    studentId: "s1",
    studentName: "John Doe",
    courseId: "cs101",
    courseName: "Introduction to Computer Science",
    title: "Issue with Assignment Deadline",
    description: "The deadline for the last assignment was too short given the complexity of the tasks.",
    status: "resolved",
    createdAt: "2023-10-15T10:30:00Z",
    updatedAt: "2023-10-18T14:20:00Z",
    messages: [
      {
        id: uuidv4(),
        senderId: "s1",
        senderName: "John Doe",
        senderRole: "student",
        content: "The deadline for the last assignment was too short given the complexity of the tasks.",
        timestamp: "2023-10-15T10:30:00Z"
      },
      {
        id: uuidv4(),
        senderId: "l1",
        senderName: "Dr. Robert Brown",
        senderRole: "lecturer",
        content: "I understand your concern. The deadline has been extended by one week.",
        timestamp: "2023-10-16T13:15:00Z"
      },
      {
        id: uuidv4(),
        senderId: "s1",
        senderName: "John Doe",
        senderRole: "student",
        content: "Thank you for understanding and extending the deadline.",
        timestamp: "2023-10-16T15:45:00Z"
      }
    ]
  },
  {
    id: uuidv4(),
    referenceNumber: "COMP-2023-002",
    studentId: "s1",
    studentName: "John Doe",
    courseId: "math201",
    courseName: "Calculus II",
    title: "Unclear Grading Criteria",
    description: "The grading criteria for the midterm exam were not clearly explained.",
    status: "in-progress",
    createdAt: "2023-10-25T09:15:00Z",
    updatedAt: "2023-10-26T11:30:00Z",
    messages: [
      {
        id: uuidv4(),
        senderId: "s1",
        senderName: "John Doe",
        senderRole: "student",
        content: "The grading criteria for the midterm exam were not clearly explained.",
        timestamp: "2023-10-25T09:15:00Z"
      },
      {
        id: uuidv4(),
        senderId: "l2",
        senderName: "Prof. Emily White",
        senderRole: "lecturer",
        content: "I'll review the grading criteria and provide more clarity in the next class.",
        timestamp: "2023-10-26T11:30:00Z"
      }
    ]
  },
  {
    id: uuidv4(),
    referenceNumber: "COMP-2023-003",
    studentId: "s2",
    studentName: "Jane Smith",
    courseId: "cs101",
    courseName: "Introduction to Computer Science",
    title: "Request for Additional Reference Materials",
    description: "Could you provide additional reference materials for the upcoming project?",
    status: "pending",
    createdAt: "2023-11-05T14:45:00Z",
    updatedAt: "2023-11-05T14:45:00Z",
    messages: [
      {
        id: uuidv4(),
        senderId: "s2",
        senderName: "Jane Smith",
        senderRole: "student",
        content: "Could you provide additional reference materials for the upcoming project?",
        timestamp: "2023-11-05T14:45:00Z"
      }
    ]
  }
];

// Local storage keys
const USERS_STORAGE_KEY = "university_cms_users";
const COMPLAINTS_STORAGE_KEY = "university_cms_complaints";
const COURSES_STORAGE_KEY = "university_cms_courses";
const CURRENT_USER_KEY = "university_cms_current_user";

// Initialize local storage with mock data
export const initializeLocalStorage = () => {
  console.log("Initializing local storage with mock data");
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
  localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(initialComplaints));
  localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(initialCourses));
};

// Export accessor functions to get data from localStorage
export const getUsers = (): User[] => {
  // Make sure storage is initialized before trying to access it
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  if (!storedUsers) {
    initializeLocalStorage();
    return initialUsers;
  }
  return JSON.parse(storedUsers);
};

export const getCourses = (): Course[] => {
  const storedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
  if (!storedCourses) {
    initializeLocalStorage();
    return initialCourses;
  }
  return JSON.parse(storedCourses);
};

export const getComplaints = (userId: string, role: string): Complaint[] => {
  const storedComplaints = localStorage.getItem(COMPLAINTS_STORAGE_KEY);
  if (!storedComplaints) {
    initializeLocalStorage();
    return [];
  }
  
  const complaints = JSON.parse(storedComplaints);
  
  if (role === "student") {
    return complaints.filter((c: Complaint) => c.studentId === userId);
  } else if (role === "lecturer") {
    const userCourses = getUsers().find(u => u.id === userId)?.courses || [];
    return complaints.filter((c: Complaint) => userCourses.includes(c.courseId));
  }
  
  return [];
};

// Authentication functions
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

export const login = (email: string, password: string): User | null => {
  console.log(`Login attempt with email: ${email}`);
  
  // Always initialize storage first
  initializeLocalStorage();
  
  // Get users directly from initialUsers array to ensure we have all users
  // This ensures we're not relying on potentially empty localStorage
  const user = initialUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  
  console.log("Found user:", user);
  
  if (user) {
    // Store user in localStorage
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Complaint management functions
export const getComplaintById = (complaintId: string): Complaint | undefined => {
  // Initialize storage if not already done
  initializeLocalStorage();
  const storedComplaints = JSON.parse(localStorage.getItem(COMPLAINTS_STORAGE_KEY) || "[]");
  return storedComplaints.find((c: Complaint) => c.id === complaintId);
};

export const createComplaint = (complaint: Omit<Complaint, 'id' | 'referenceNumber' | 'createdAt' | 'updatedAt'>): Complaint => {
  const storedComplaints = JSON.parse(localStorage.getItem(COMPLAINTS_STORAGE_KEY) || "[]");
  
  // Generate a unique reference number
  const referenceNumber = `COMP-${new Date().getFullYear()}-${(storedComplaints.length + 1).toString().padStart(3, '0')}`;
  
  const newComplaint: Complaint = {
    id: uuidv4(),
    referenceNumber,
    ...complaint,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  storedComplaints.push(newComplaint);
  localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(storedComplaints));
  
  toast.success(`Complaint created with reference number: ${referenceNumber}`);
  return newComplaint;
};

export const updateComplaintStatus = (complaintId: string, status: "pending" | "in-progress" | "resolved"): Complaint | undefined => {
  const storedComplaints = JSON.parse(localStorage.getItem(COMPLAINTS_STORAGE_KEY) || "[]");
  const complaintIndex = storedComplaints.findIndex((c: Complaint) => c.id === complaintId);
  
  if (complaintIndex !== -1) {
    storedComplaints[complaintIndex].status = status;
    storedComplaints[complaintIndex].updatedAt = new Date().toISOString();
    
    localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(storedComplaints));
    
    toast.success(`Complaint status updated to ${status}`);
    return storedComplaints[complaintIndex];
  }
  
  return undefined;
};

export const deleteComplaint = (complaintId: string): boolean => {
  const storedComplaints = JSON.parse(localStorage.getItem(COMPLAINTS_STORAGE_KEY) || "[]");
  const updatedComplaints = storedComplaints.filter((c: Complaint) => c.id !== complaintId);
  
  if (updatedComplaints.length < storedComplaints.length) {
    localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(updatedComplaints));
    toast.success("Complaint deleted successfully");
    return true;
  }
  
  return false;
};

export const addMessage = (complaintId: string, message: Omit<Message, 'id' | 'timestamp'>): Complaint | undefined => {
  const storedComplaints = JSON.parse(localStorage.getItem(COMPLAINTS_STORAGE_KEY) || "[]");
  const complaintIndex = storedComplaints.findIndex((c: Complaint) => c.id === complaintId);
  
  if (complaintIndex !== -1) {
    const newMessage: Message = {
      id: uuidv4(),
      ...message,
      timestamp: new Date().toISOString()
    };
    
    storedComplaints[complaintIndex].messages.push(newMessage);
    storedComplaints[complaintIndex].updatedAt = new Date().toISOString();
    
    localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(storedComplaints));
    
    toast.success("Message added successfully");
    return storedComplaints[complaintIndex];
  }
  
  return undefined;
};

// Course functions
export const getUserCourses = (userId: string): Course[] => {
  const currentUser = getUsers().find(u => u.id === userId);
  const userCourses = currentUser?.courses || [];
  
  return getCourses().filter(c => userCourses.includes(c.id));
};
