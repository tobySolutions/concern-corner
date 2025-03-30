
export type User = {
  id: string;
  name: string;
  email: string;
  role: "student" | "lecturer";
  courses?: string[];
};

export type Complaint = {
  id: string;
  referenceNumber: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "resolved";
  createdAt: string;
  updatedAt: string;
  messages: Message[];
};

export type Message = {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "student" | "lecturer";
  content: string;
  timestamp: string;
};

export type Course = {
  id: string;
  code: string;
  name: string;
  lecturerId: string;
};
