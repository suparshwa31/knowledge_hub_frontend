import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./button";
import { Brain } from "lucide-react";

interface NavbarProps {
  hideSignIn?: boolean;
  hideSignUp?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ hideSignIn, hideSignUp }) => {
  const location = useLocation();
  const isSignUpPage = location.pathname.includes('/auth/sign-up');

  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Knowledge Hub</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {/* If on signup page, move Sign In button to the right */}
            {isSignUpPage ? (
              hideSignIn ? (
                <span className="invisible">
                  <Button variant="outline" size="sm">Sign In</Button>
                </span>
              ) : (
                <Link to="/auth/login">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
              )
            ) : (
              <>
                {hideSignIn ? (
                  <span className="invisible">
                    <Button variant="outline" size="sm">Sign In</Button>
                  </span>
                ) : (
                  <Link to="/auth/login">
                    <Button variant="outline" size="sm">Sign In</Button>
                  </Link>
                )}
                {hideSignUp ? (
                  <span className="invisible">
                    <Button size="sm">Get Started</Button>
                  </span>
                ) : (
                  <Link to="/auth/sign-up">
                    <Button size="sm">Get Started</Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;