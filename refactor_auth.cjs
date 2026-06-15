const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/AdminPanel.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update Imports
content = content.replace(
  /import { db, isFirebaseConfigured } from "@\/lib\/firebase";/,
  `import { db, auth, isFirebaseConfigured } from "@/lib/firebase";\nimport { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";`
);

// 2. Remove passcode state and add email/password
content = content.replace(
  /const \[passcode, setPasscode\] = useState\(""\);/,
  `const [email, setEmail] = useState("");\n  const [password, setPassword] = useState("");`
);

// 3. Update useEffect for auth state
const oldUseEffect = `  useEffect(() => {
    // Check if passcode is saved
    const authed = sessionStorage.getItem("tbi_admin_authed");
    if (authed === "true") {
      setIsAuthenticated(true);
    }
    setRegistrations(getRegistrations());

    const handler = () => {
      setRegistrations(getRegistrations());
    };
    window.addEventListener("tbi_store_update", handler);
    return () => window.removeEventListener("tbi_store_update", handler);
  }, []);`;

const newUseEffect = `  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setIsAuthenticated(!!user);
      });
      
      setRegistrations(getRegistrations());
      const handler = () => {
        setRegistrations(getRegistrations());
      };
      window.addEventListener("tbi_store_update", handler);
      
      return () => {
        unsubscribe();
        window.removeEventListener("tbi_store_update", handler);
      };
    } else {
      // Fallback for local dev if firebase is not configured
      const authed = sessionStorage.getItem("tbi_admin_authed");
      if (authed === "true") {
        setIsAuthenticated(true);
      }
      setRegistrations(getRegistrations());
      const handler = () => setRegistrations(getRegistrations());
      window.addEventListener("tbi_store_update", handler);
      return () => window.removeEventListener("tbi_store_update", handler);
    }
  }, []);`;

content = content.replace(oldUseEffect, newUseEffect);

// 4. Update handleLogin
const oldHandleLogin = `  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = false;

    if (isFirebaseConfigured && db) {
      try {
        const docSnap = await getDoc(doc(db, "admin_config", "passcode"));
        if (docSnap.exists()) {
          const data = docSnap.data();
          const validList = data?.validPasscodes || [];
          if (Array.isArray(validList) && validList.includes(passcode)) {
            isValid = true;
          }
        } else {
          if (passcode === "admin" || passcode === "tbio2026") {
            isValid = true;
          }
        }
      } catch (err) {
        console.error("Firebase passcode validation error, using local fallback:", err);
        if (passcode === "admin" || passcode === "tbio2026") {
          isValid = true;
        }
      }
    } else {
      if (passcode === "admin" || passcode === "tbio2026") {
        isValid = true;
      }
    }

    if (isValid) {
      setIsAuthenticated(true);
      sessionStorage.setItem("tbi_admin_authed", "true");
      toast.success("Welcome back, Admin!");
    } else {
      toast.error("Incorrect passcode. Try again.");
    }
  };`;

const newHandleLogin = `  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFirebaseConfigured && auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back, Admin!");
        setEmail("");
        setPassword("");
      } catch (err: any) {
        console.error("Login failed:", err);
        toast.error("Invalid email or password. Try again.");
      }
    } else {
      // Local fallback for testing without firebase config
      if (password === "admin") {
        setIsAuthenticated(true);
        sessionStorage.setItem("tbi_admin_authed", "true");
        toast.success("Welcome back, Admin (Local mode)!");
      } else {
        toast.error("Incorrect local password.");
      }
    }
  };`;

content = content.replace(oldHandleLogin, newHandleLogin);

// 5. Update handleLogout
const oldHandleLogout = `  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("tbi_admin_authed");
    toast.success("Logged out successfully.");
  };`;

const newHandleLogout = `  const handleLogout = async () => {
    if (auth) {
      try {
        await signOut(auth);
        toast.success("Logged out successfully.");
      } catch (err) {
        console.error("Error signing out", err);
      }
    } else {
      setIsAuthenticated(false);
      sessionStorage.removeItem("tbi_admin_authed");
      toast.success("Logged out successfully.");
    }
  };`;

content = content.replace(oldHandleLogout, newHandleLogout);

// 6. Update Login Form UI
const oldFormUi = `              <div className="text-left">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                  Passcode
                </label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-background border border-foreground/20 px-4 py-3 text-sm rounded-none focus:outline-none focus:border-primary transition-all text-foreground"
                  autoFocus
                />
              </div>`;

const newFormUi = `              <div className="space-y-4 text-left">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full bg-background border border-foreground/20 px-4 py-3 text-sm rounded-none focus:outline-none focus:border-primary transition-all text-foreground"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-background border border-foreground/20 px-4 py-3 text-sm rounded-none focus:outline-none focus:border-primary transition-all text-foreground"
                  />
                </div>
              </div>`;

content = content.replace(oldFormUi, newFormUi);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Refactoring complete");
