import React, { useEffect, useRef, useState } from 'react';
import stripIndent from 'strip-indent';
import Loading from './Loading';
import * as styles from './DescriptionDialog.module.css';
import type { Server } from '../utils/hub';

const Markdown = React.lazy(() => import('react-markdown'));

type DescriptionDialogProps = {
  server: Server & { description: string },
  isOpen: boolean,
  onCloseDescription: () => void,
};
function DescriptionDialog({ server, isOpen, onCloseDescription }: DescriptionDialogProps) {
  const [everOpened, setEverOpened] = useState(false);
  const loading = (
    <div className={styles.loading}>
      <Loading message="Loading description..." />
    </div>
  );

  const dialog = useRef<HTMLDialogElement>();
  useEffect(() => {
    if (isOpen) {
      dialog.current.showModal();
      setEverOpened(true);
    }
    return () => {
      dialog.current.close();
    };
  }, [isOpen]);

  return (
    <dialog ref={dialog} onClose={onCloseDescription} className={styles.root}>
      <form method="dialog">
        <h2 className={styles.title}>
          {server.name}
        </h2>
        <div className={styles.content}>
          {everOpened ? (
            <React.Suspense fallback={loading}>
              <div className={styles.markdown}>
                <Markdown>{stripIndent(server.description)}</Markdown>
              </div>
            </React.Suspense>
          ) : loading}
        </div>
        <div className={styles.actions}>
          <button className={styles.closeButton}>
            Close
          </button>
          <a href={server.url} className={styles.joinButton}>
            Join
          </a>
        </div>
      </form>
    </dialog>
  );
}

export default DescriptionDialog;
