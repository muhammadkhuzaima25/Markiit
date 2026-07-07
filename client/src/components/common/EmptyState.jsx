import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ icon: Icon = FiInbox, title = 'Nothing here yet', message = 'There are no items to display.', action, actionText, actionLink }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-neutral flex items-center justify-center mb-4">
        <Icon size={32} className="text-charcoal-light" />
      </div>
      <h3 className="text-lg font-semibold text-charcoal mb-2">{title}</h3>
      <p className="text-charcoal-light text-sm max-w-md mb-4">{message}</p>
      {action && actionText && (
        actionLink ? (
          <a href={actionLink} onClick={action} className="bg-accent text-primary px-6 py-2 rounded-lg font-semibold text-sm hover:bg-accent-dark no-underline transition-colors">
            {actionText}
          </a>
        ) : (
          <button onClick={action} className="bg-accent text-primary px-6 py-2 rounded-lg font-semibold text-sm hover:bg-accent-dark border-none cursor-pointer transition-colors">
            {actionText}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
