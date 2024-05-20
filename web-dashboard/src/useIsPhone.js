import { useState, useEffect } from 'react';

function useIsPhone() {
  const [isPhone, setIsPhone] = useState(window.innerWidth <= 768);

  useEffect(() => {
    function handleResize() {
      setIsPhone(window.innerWidth <= 768);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isPhone;
}

export default useIsPhone;
