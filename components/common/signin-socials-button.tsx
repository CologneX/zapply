import { AuthGoogleAction } from "@/services/auth.service";

export const SignInWithGoogle = async () => (
  <form action={AuthGoogleAction} className="m-0">
    <button
      type="submit"
      aria-label="Sign in with Google"
      className="w-full h-11 flex items-center justify-center gap-3 rounded-md border bg-white text-sm font-medium text-slate-900 hover:bg-slate-50 active:opacity-95"
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 533.5 544.3"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
      >
        <path
          fill="#4285F4"
          d="M533.5 278.4c0-18.7-1.5-37-4.5-54.6H272v103.3h146.9c-6.3 34.1-25.1 62.9-53.7 82.3v68.4h86.8c50.8-46.8 81.5-115.9 81.5-199.7z"
        />
        <path
          fill="#34A853"
          d="M272 544.3c72.6 0 133.7-24 178.3-65.2l-86.8-68.4c-24.2 16.2-55.2 25.8-91.5 25.8-70.4 0-130.1-47.6-151.4-111.6H31.7v70.6C76.3 486.3 167.7 544.3 272 544.3z"
        />
        <path
          fill="#FBBC05"
          d="M120.6 325.5c-10.6-31.7-10.6-65.9 0-97.6V157.3H31.7c-39.9 78.3-39.9 171.1 0 249.4l88.9-81.2z"
        />
        <path
          fill="#EA4335"
          d="M272 107.7c38.9 0 73.9 13.4 101.5 39l76.1-76.1C405.5 24.6 344.4 0 272 0 167.7 0 76.3 58 31.7 157.3l88.9 70.6C141.9 155.3 201.6 107.7 272 107.7z"
        />
      </svg>
      <span className="text-sm">Continue with Google</span>
    </button>
  </form>
);

export const SignInWithLinkedIn = () => (
  <div className="m-0">
    <button
      type="button"
      aria-label="Sign in with LinkedIn"
      className="w-full h-11 flex items-center justify-center gap-3 rounded-md border bg-[#0A66C2] text-sm font-medium text-white hover:brightness-95 active:opacity-95"
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 34 34"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
      >
        <title>LinkedIn</title>
        <g>
          <rect fill="#0A66C2" width="34" height="34" rx="4" />
          <g transform="translate(6,7)" fill="#FFFFFF">
            <path d="M2 9.5H0V3.5h2v6zM1 0C.45 0 0 .45 0 1s.45 1 1 1 1-.45 1-1S1.55 0 1 0zM11 9.5h-2V6.8c0-.7 0-1.6-1-1.6s-1.2.8-1.2 1.6V9.5H5V3.5h2v.9c.3-.6 1.3-1.1 2.1-1.1 2.1 0 2.6 1.3 2.6 3v3.2z" />
          </g>
        </g>
      </svg>
      <span className="text-sm">Continue with LinkedIn</span>
    </button>
  </div>
);
