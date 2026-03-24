import React, { useEffect, useState } from 'react';
import { followService } from '../../services/followService';
import Avatar from '../Common/Avatar';
import LoadingSpinner from '../Common/LoadingSpinner';
import Button from '../Common/Button';
import { useNavigate } from 'react-router-dom';

const FollowingList = ({ userId }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await followService.getFollowing(userId);
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch following', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) fetchData();
  }, [userId]);

  if (isLoading) return <LoadingSpinner />;

  if (users.length === 0) return (
    <div style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--text-secondary)' }}>
      Not following anyone yet.
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
      {users.map(u => {
        const fUser = u.following || u; 
        return (
          <div key={fUser._id} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--spacing-3)',
            backgroundColor: 'var(--surface-color)',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
              onClick={() => navigate(`/profile/${fUser._id}`)}
              className="hover-scale"
            >
              <Avatar src={fUser.profilePicture} name={fUser.name} />
              <div>
                <div style={{ fontWeight: '600', fontSize: '15px' }}>{fUser.name}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>@{fUser.username}</div>
              </div>
            </div>
            <Button size="sm" variant="secondary" onClick={() => navigate(`/profile/${fUser._id}`)}>View Profile</Button>
          </div>
        );
      })}
    </div>
  );
};

export default FollowingList;
