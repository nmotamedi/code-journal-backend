import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPencilAlt } from 'react-icons/fa';
import { Entry, readEntries } from '../data';
import { useUser } from '../components/useUser';

export function EntryList() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const { user, handleSignOut } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const entries = await readEntries();
        setEntries(entries);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        Error Loading Entries:{' '}
        {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }

  return (
    <div className="container">
      <div className="flex flex-wrap mb-4">
        {user && (
          <div className="relative flex-grow flex-1 px-4">
            <button
              className="inline-block align-middle text-center border rounded py-1 px-3 bg-blue-600 text-white"
              onClick={() => {
                handleSignOut();
                navigate('/');
              }}>
              Sign Out
            </button>
          </div>
        )}
        {!user && (
          <>
            <div className="relative flex-grow flex-1 px-4">
              <button
                className="inline-block align-middle text-center border rounded py-1 px-3 bg-blue-600 text-white"
                onClick={() => navigate('sign-up')}>
                Sign Up
              </button>
            </div>
            <div className="relative flex-grow flex-1 px-4">
              <button
                className="inline-block align-middle text-center border rounded py-1 px-3 bg-blue-600 text-white"
                onClick={() => navigate('sign-in')}>
                Sign In
              </button>
            </div>
          </>
        )}
        {user && (
          <>
            <div className="column-full d-flex justify-between align-center">
              <h1>Entries</h1>
              <h3>
                <Link to="/details/new" className="white-text form-link">
                  NEW
                </Link>
              </h3>
            </div>
            <div className="row">
              <div className="column-full">
                <ul className="entry-ul">
                  {entries.map((entry) => (
                    <EntryCard key={entry.entryId} entry={entry} />
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

type EntryProps = {
  entry: Entry;
};
function EntryCard({ entry }: EntryProps) {
  return (
    <li>
      <div className="row">
        <div className="column-half">
          <img
            className="input-b-radius form-image"
            src={entry.photoUrl}
            alt=""
          />
        </div>
        <div className="column-half">
          <div className="row">
            <div className="column-full d-flex justify-between">
              <h3>{entry.title}</h3>
              <Link to={`details/${entry.entryId}`}>
                <FaPencilAlt />
              </Link>
            </div>
          </div>
          <p>{entry.notes}</p>
        </div>
      </div>
    </li>
  );
}

//   return (
//     <div className="container m-4">
//       <div className="flex flex-wrap mb-4">
//         {!user && (
//           <>
//             <div className="relative flex-grow flex-1 px-4">
//               <button
//                 className="inline-block align-middle text-center border rounded py-1 px-3 bg-blue-600 text-white"
//                 onClick={() => navigate('sign-up')}>
//                 Sign Up
//               </button>
//             </div>
//             <div className="relative flex-grow flex-1 px-4">
//               <button
//                 className="inline-block align-middle text-center border rounded py-1 px-3 bg-blue-600 text-white"
//                 onClick={() => navigate('sign-in')}>
//                 Sign In
//               </button>
//             </div>
//           </>
//         )}
//         {user && (
//           <div className="relative flex-grow flex-1 px-4">
//             <button
//               className="inline-block align-middle text-center border rounded py-1 px-3 bg-blue-600 text-white"
//               onClick={() => {
//                 handleSignOut();
//                 navigate('/');
//               }}>
//               Sign Out
//             </button>
//           </div>
//         )}
//       </div>
//       {user && (
//         <p className="py-2">
//           Signed in as {user.username} with ID: {user.userId}
//         </p>
//       )}
//       {!user && <p>Not signed in</p>}
//       {user && <Todos />}
//     </div>
