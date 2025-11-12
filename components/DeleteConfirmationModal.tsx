import Modal from '@components/Modal';
import React, { Dispatch, SetStateAction, useRef } from 'react';

interface DeleteConfirmationModalProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    onConfirm: (() => Promise<void>) | (() => void);
    resourceName: string;
    resourceType: string;
}

function DeleteConfirmationModal({
    open,
    setOpen,
    onConfirm,
    resourceName,
    resourceType,
}: DeleteConfirmationModalProps): React.ReactNode {
    const cancelButtonRef = useRef(null);

    const handleConfirm = async (): Promise<void> => {
        try {
            await onConfirm();
            setOpen(false);
        } catch (error) {
            console.error('Error confirming deletion:', error);
        }
    };

    return (
        <Modal title={`Delete ${resourceType}`} isOpen={open} onClose={() => setOpen(false)}>
            <div className="bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"> 
                        {/* Warning Icon */}
                        <svg
                            className="h-6 w-6 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Delete {resourceType}
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Are you sure you want to delete{' '}
                                <span className="font-bold">{resourceName}</span>? This action
                                cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-100 text-base font-medium text-white hover:bg-primary-100/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
                        /* eslint-disable-next-line no-void */
                        onClick={() => void handleConfirm()}
                    >
                        Confirm
                    </button>
                    <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                    >
                        No
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default DeleteConfirmationModal;
