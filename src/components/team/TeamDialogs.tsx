
import React from 'react';
import MemberDialog from './dialogs/MemberDialog';
import ContactDialog from './dialogs/ContactDialog';
import ShareDialog from './dialogs/ShareDialog';

interface TeamDialogsProps {
  team: any;
  selectedMember: any;
  showMemberDialog: boolean;
  setShowMemberDialog: (show: boolean) => void;
  showContactDialog: boolean;
  setShowContactDialog: (show: boolean) => void;
  showShareDialog: boolean;
  setShowShareDialog: (show: boolean) => void;
  contactMessage: string;
  setContactMessage: (message: string) => void;
  contactSubject: string;
  setContactSubject: (subject: string) => void;
  handleSendMessage: () => void;
  handleShareVia: (method: string) => void;
}

const TeamDialogs = ({
  team,
  selectedMember,
  showMemberDialog,
  setShowMemberDialog,
  showContactDialog,
  setShowContactDialog,
  showShareDialog,
  setShowShareDialog,
  contactMessage,
  setContactMessage,
  contactSubject,
  setContactSubject,
  handleSendMessage,
  handleShareVia
}: TeamDialogsProps) => {
  return (
    <>
      <MemberDialog
        selectedMember={selectedMember}
        showMemberDialog={showMemberDialog}
        setShowMemberDialog={setShowMemberDialog}
      />
      <ContactDialog
        team={team}
        showContactDialog={showContactDialog}
        setShowContactDialog={setShowContactDialog}
        contactMessage={contactMessage}
        setContactMessage={setContactMessage}
        contactSubject={contactSubject}
        setContactSubject={setContactSubject}
        handleSendMessage={handleSendMessage}
      />
      <ShareDialog
        team={team}
        showShareDialog={showShareDialog}
        setShowShareDialog={setShowShareDialog}
        handleShareVia={handleShareVia}
      />
    </>
  );
};

export default TeamDialogs;
