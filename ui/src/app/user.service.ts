import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, shareReplay } from 'rxjs/operators';
import { API_URL, SESS_COOKIE } from 'src/environments/environment';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: User = null;
  private authOptions = { withCredentials: true };
  private redirectUrl: string | null = null;

  constructor(private http: HttpClient) {
    if (this.isLoggedIn() && !this.user) {
      this.restoreUserInfo();
    }
  }

  /// Attempts to restore and return the information of the current user.
  /// Throws an exception if the info is missing.
  public getUser(): User {
    if (!this.user) {
      this.restoreUserInfo();
    }
    if (!this.user) {
      throw new Error("Failed to restore user info. Authentication is required.")
    }
    return this.user;
  }

  /// Restores the user information from localStorage or clears the 
  /// the session cookie if it's not available.
  private restoreUserInfo() {
    // TODO: check if the token has expired here

    const id = window.localStorage.getItem("_id");
    const username = window.localStorage.getItem("_username");
    const email = window.localStorage.getItem("_email");

    // If the data is in local storage, create the user object
    if (id && username && email) {
      this.user = new User(id, username, email);
      return;
    }

    // XXX: try to get the info from the server instead?

    // Otherwise, clear the cookie to force the user re-login.
    UserService.deleteCookie(SESS_COOKIE);
  }

  /// Saves the user information to localStorage.
  private saveUserInfo(user: User) {
    this.user = user;
    window.localStorage.setItem("_id", user.id);
    window.localStorage.setItem("_username", user.username);
    window.localStorage.setItem("_email", user.email);
  }

  register(user: User, password: string) {
    return this.http.post<User>(`${API_URL}/users/register`, { ...user, password: password }, this.authOptions)
      .pipe(tap(this.saveUserInfo))
      .pipe(shareReplay(1));
  }

  login(email: string, password: string) {
    return this.http.post<User>(`${API_URL}/auth/login`, { email: email, password: password }, this.authOptions)
      .pipe(tap(this.saveUserInfo))
      .pipe(shareReplay(1));
  }

  logout() {
    return this.http.get(`${API_URL}/auth/logout`).pipe(tap((_) => {
      // Clearing the cookie on the server doesn't seem to work.
      // This we're going to clear it on the client as well.
      UserService.deleteCookie(SESS_COOKIE)
    }));
  }

  isLoggedIn(): boolean {
    return UserService.getCookie(SESS_COOKIE) != null;
  }

  /// Sets the redirect URL to the given value.
  setRedirectURL(url: string) {
    this.redirectUrl = url;
  }

  /// Removes from the service and returns the redirect URL 
  extractRedirectUrl(): string | null {
    const url = this.redirectUrl;
    this.redirectUrl = null;
    return url;
  }

  static getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2
      ? parts.pop().split(';').shift()
      : null;
  }

  static deleteCookie(name: string) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
}
