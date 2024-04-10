import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { EntryList } from './EntryList';

export function Home() {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <>
      <div className="container">
        <div className="flex flex-wrap mb-4">
          {!user && (
            <div className="flex">
              <div className="relative flex-grow flex-1 px-4">
                <button
                  className="white-text form-link inline-block align-middle text-center border rounded py-1 px-3 bg-blue-600 text-white"
                  onClick={() => navigate('sign-up')}>
                  Sign Up
                </button>
              </div>
              <div className="relative flex-grow flex-1 px-4">
                <button
                  className="white-text form-link inline-block align-middle text-center border rounded py-1 px-3 bg-blue-600 text-white"
                  onClick={() => navigate('sign-in')}>
                  Sign In
                </button>
              </div>
            </div>
          )}
          {user && <EntryList />}
        </div>
      </div>
    </>
  );
}
