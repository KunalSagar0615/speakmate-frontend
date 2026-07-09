export const API_BASE_URL = "https://speakmate-ai-friend.onrender.com";
export const TOKEN_KEY = "speakmate_token";
export const ROLE_KEY = "speakmate_role";
export const USER_KEY = "speakmate_user";
export const THEME_KEY = "speakmate_theme";

export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
};

export const SESSION_MODES = {
  FRIEND: "FRIEND",
  ENGLISH_COACH: "ENGLISH_COACH",
  INTERVIEW: "INTERVIEW",
};

export const MODES = [SESSION_MODES.FRIEND, SESSION_MODES.ENGLISH_COACH, SESSION_MODES.INTERVIEW];
export const COMMUNICATION_TYPES = ["CHAT", "VOICE"];
export const DIFFICULTY_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export const SESSION_MODE_LABELS = {
  FRIEND: "AI Friend",
  ENGLISH_COACH: "AI Teacher",
  INTERVIEW: "AI Interviewer",
};

export const DIFFICULTY_LABELS = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

export const TOPIC_SUGGESTIONS_BY_MODE = {
  FRIEND: ["Daily Conversation", "Travel", "Movies", "Friends", "Hobbies", "Life Goals"],
  ENGLISH_COACH: [
    "English Speaking",
    "Grammar Practice",
    "Vocabulary Building",
    "Pronunciation",
    "Daily English",
  ],
  INTERVIEW: ["HR Interview", "Java Interview", "Spring Boot", "React Interview", "SQL Interview"],
};

export const FOUNDER_PROFILE_IMAGE =
  "https://ui-avatars.com/api/?name=Kunal+Ananda+Sagar&size=200&background=0ea5e9&color=fff&bold=true";

export const formatMode = (mode) => SESSION_MODE_LABELS[mode] || mode;
export const formatDifficulty = (level) => DIFFICULTY_LABELS[level] || level;
