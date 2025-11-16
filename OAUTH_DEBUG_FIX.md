# Google OAuth Login - Debug & Fix Summary

## Problem Identified
The error `localhost:3000/auth/undefined/oauth2/authorization/google` showed that `API_BASE_URL` was evaluating to `undefined`, causing the OAuth redirect to fail.

## Root Cause
The import `import { API_BASE_URL } from "@/src/lib/auth"` was not resolving correctly, likely due to:
1. Module resolution timing issues in Next.js
2. Client-side vs server-side rendering conflicts
3. TypeScript path alias resolution

## Solutions Implemented

### 1. Created Environment Variable (`.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

**Why:** Environment variables prefixed with `NEXT_PUBLIC_` are automatically injected into the browser bundle by Next.js.

### 2. Updated `src/lib/auth.ts`
```typescript
export const API_BASE_URL = 
  typeof window !== 'undefined' && (window as any).NEXT_PUBLIC_API_BASE_URL 
    ? (window as any).NEXT_PUBLIC_API_BASE_URL 
    : process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
```

**Why:** This provides multiple fallback mechanisms:
- First checks if running in browser and environment variable exists
- Falls back to process.env for server-side rendering
- Ultimate fallback to hardcoded localhost:8080

### 3. Added Debug Logging in `login/page.tsx`
```typescript
console.log('API_BASE_URL:', API_BASE_URL);
console.log('Full OAuth URL:', `${API_BASE_URL}/oauth2/authorization/google`);
```

**Why:** Helps verify the URL is constructed correctly before redirection.

## How OAuth Flow Works Now

### 1. **User Clicks "Continue with Google"**
```typescript
const handleGoogleLogin = () => {
  setIsLoading(true);
  console.log('API_BASE_URL:', API_BASE_URL);  // Should log: http://localhost:8080
  window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
};
```

### 2. **Full-Page Redirect to Backend**
- Browser navigates to: `http://localhost:8080/oauth2/authorization/google`
- Spring Boot OAuth2 handles the request
- Redirects to Google's OAuth consent screen

### 3. **Google Callback to Backend**
- After user authorizes, Google redirects back to your Spring Boot backend
- Backend generates JWT token
- Backend redirects to: `http://localhost:3000/home?token=YOUR_JWT_TOKEN`

### 4. **Frontend Callback Handler** (`/app/home/page.tsx`)
```typescript
useEffect(() => {
  const token = searchParams?.get("token");
  if (token) {
    saveToken(token);  // Saves to localStorage
    router.replace("/jobs");  // Redirects to protected route
    return;
  }
  router.replace("/auth/login");  // No token, back to login
}, [router, searchParams]);
```

## Backend Requirements (Spring Boot)

### 1. OAuth2 Configuration
Your Spring Boot backend needs:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .oauth2Login(oauth2 -> oauth2
                .successHandler((request, response, authentication) -> {
                    // Generate JWT token
                    String token = jwtService.generateToken(authentication);
                    
                    // Redirect to Next.js with token
                    response.sendRedirect("http://localhost:3000/home?token=" + token);
                })
            );
        return http.build();
    }
}
```

### 2. CORS Configuration
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### 3. Google OAuth2 Properties (`application.yml`)
```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            scope:
              - email
              - profile
            redirect-uri: "http://localhost:8080/login/oauth2/code/google"
```

## Testing Steps

### 1. Verify Backend is Running
```bash
# Check if Spring Boot is running on port 8080
curl http://localhost:8080/oauth2/authorization/google
```
**Expected:** Should redirect to Google OAuth consent screen

### 2. Check Next.js Console
Open browser console (`F12`) and click "Continue with Google"

**Expected Console Output:**
```
API_BASE_URL: http://localhost:8080
Full OAuth URL: http://localhost:8080/oauth2/authorization/google
```

### 3. Monitor Network Tab
1. Open Developer Tools → Network tab
2. Click "Continue with Google"
3. Should see redirect chain:
   - `localhost:3000` → `localhost:8080/oauth2/authorization/google`
   - `localhost:8080` → Google OAuth (accounts.google.com)
   - Google → `localhost:8080/login/oauth2/code/google`
   - Backend → `localhost:3000/home?token=...`

## Common Issues & Solutions

### Issue 1: Still Getting 404
**Solution:** 
- Clear browser cache and cookies
- Hard refresh (Ctrl+F5)
- Check console for actual API_BASE_URL value
- Restart Next.js server: `npm run dev`

### Issue 2: CORS Errors
**Solution:**
- Ensure backend CORS configuration allows `http://localhost:3000`
- Check backend is running on port 8080
- Verify Spring Security permits OAuth endpoints

### Issue 3: Token Not Saved
**Solution:**
- Check `/home` page is receiving `token` query parameter
- Verify `saveToken()` function executes
- Check localStorage in browser DevTools (Application → Local Storage)

### Issue 4: Redirect Loop
**Solution:**
- Ensure backend redirects to `/home?token=...` not `/jobs`
- Check home page properly extracts token from URL
- Verify router.replace() is called, not router.push()

## Environment Variables Summary

### `.env.local` (Next.js Frontend)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### `.env` (Spring Boot Backend)
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

## Files Modified

1. **`.env.local`** - Created
   - Added `NEXT_PUBLIC_API_BASE_URL`

2. **`src/lib/auth.ts`** - Updated
   - Changed API_BASE_URL to use environment variable with fallbacks

3. **`app/auth/login/page.tsx`** - Updated
   - Added console logging for debugging

## Verification Checklist

- [x] Environment variable created (`.env.local`)
- [x] Auth utility updated with fallback mechanism
- [x] Debug logging added
- [x] Next.js server restarted
- [ ] Backend running on http://localhost:8080 (verify with user)
- [ ] Google OAuth credentials configured in backend
- [ ] Test OAuth flow end-to-end

## Next Steps for User

1. **Verify Backend OAuth Endpoint:**
   ```bash
   curl -I http://localhost:8080/oauth2/authorization/google
   ```
   Should return 302 redirect or similar

2. **Check Backend Logs:**
   - Ensure OAuth2 client registration is loaded
   - No errors about missing Google credentials

3. **Test Full Flow:**
   - Navigate to http://localhost:3000/auth/login
   - Open browser console (F12)
   - Click "Continue with Google"
   - Verify console shows correct URL
   - Complete Google sign-in
   - Should redirect to /jobs with token stored

## Debug Checklist

If still not working:

1. **Check Console Output:**
   - Should see: `API_BASE_URL: http://localhost:8080`
   - If `undefined`, environment variable not loading

2. **Verify Backend Response:**
   ```bash
   curl -v http://localhost:8080/oauth2/authorization/google
   ```
   - Should get 302 redirect to Google
   - If 404, OAuth2 not configured in Spring Boot

3. **Check Docker Container:**
   ```bash
   docker ps  # Verify backend container is running
   docker logs <container-id>  # Check backend logs
   ```

4. **Test Backend Health:**
   ```bash
   curl http://localhost:8080/actuator/health  # If actuator enabled
   ```

## Success Criteria

✅ Console logs show `http://localhost:8080` for API_BASE_URL
✅ Clicking Google login redirects to Google OAuth page
✅ After Google sign-in, redirects back to frontend
✅ Token is saved in localStorage
✅ User is redirected to `/jobs` page
✅ Subsequent API calls include `Authorization: Bearer <token>` header

---

**Status:** Ready for testing
**Date:** October 26, 2025