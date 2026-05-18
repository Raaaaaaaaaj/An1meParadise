import { adminOwner } from "@/admin/data/adminMockData";

const ADMIN_AUTH_KEY = "admin.auth";

export interface AdminSession {
  token: string;
  owner: {
    name: string;
    mail: string;
    mobile: string;
    role: string;
  };
}

export const getAdminSession = (): AdminSession | null => {
  try {
    const stored = localStorage.getItem(ADMIN_AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    return null;
  }
};

export const isAdminAuthenticated = () => Boolean(getAdminSession()?.token);

export const saveAdminSession = (email: string) => {
  const session: AdminSession = {
    token: `admin-ui-${Date.now()}`,
    owner: {
      name: adminOwner.owner_name,
      mail: email || adminOwner.owner_mail,
      mobile: adminOwner.owner_mobile,
      role: adminOwner.role,
    },
  };

  localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(session));
  return session;
};

export const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_AUTH_KEY);
};
