import axios from "axios";
import {  useEffect, useMemo, useState } from "react";

interface ServerStatus {
  scheduledTaskStatus: boolean;
  memberTaskStatus: boolean;
}

export const useData = () => {
    const [link, setLink] = useState<string>('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');  
    const [serverStatus, setServerStatus] = useState<ServerStatus|null>(null);
    const [memberCount, setMemberCount] = useState<number>(0);
    const [isConfirmStopModalOpen, setIsConfirmStopModalOpen] = useState(false);


const serverStatusText = useMemo(() => {
  if (serverStatus === null) {
    return 'Перевірка статусу...';
  }

  if (serverStatus.scheduledTaskStatus ) {
    return 'Сервер зайнятий. Перевіряються нові товари.';
  }

  if (serverStatus.memberTaskStatus ) {
    return `Сервер зайнятий. Попередні товари Member prices ще не оброблені. \nОброблено ${memberCount} товарів.`;
  }

  return 'Сервер вільний.';

}, [serverStatus,memberCount]);

    const checkServerStatus = () => {
      axios.get('https://wizz-app.net/api/jobsStatus')
        .then(response => {
          setServerStatus(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the product data:', error);
        });
    }

    const checkMemberCount = () => {
      axios.get('https://wizz-app.net/api/checkMemberCount')
        .then(response => {
          setMemberCount(response.data.memberCount);
        })
        .catch(error => {
          console.error('There was an error fetching the product data:', error);
        });
    }

    useEffect(() => {
      checkServerStatus();
      checkMemberCount();
    }, []);
  
    const requestScraping = () => {
      axios.post('https://wizz-app.net/api/startScraping',
      {
          url: link,
      })
      .then((response) => {
        if (response.status === 200) {
        setStatus('success')
        } else {
          console.log('Unexpected status code:', response.status);
        }
    })      .catch(error => {
          console.error('There was an error deleting all products:', error);
          setError(error.response.data.error);
      });
  };

 const requestStopMemberTask = () => {
    axios.post('https://wizz-app.net/api/stopScraping')
    .then((response) => {
      if (response.status === 200) {
      setStatus('stopped')
      } else {
        console.log('Unexpected status code:', response.status);
      }
  })      .catch(error => {
        console.error('There was an error deleting all products:', error);
        setError(error.response.data.error);
    });}
   

  const handleRequest = async () => {
    if (link !== '') {
       await requestScraping();
    }
}


    

  return {
    link,
    setLink,
    handleRequest,
    status,
    setStatus,
    error,
    setError,
    serverStatusText,
    requestStopMemberTask,
    serverStatus,
    memberCount,
    isConfirmStopModalOpen,
    setIsConfirmStopModalOpen,
  };
};




