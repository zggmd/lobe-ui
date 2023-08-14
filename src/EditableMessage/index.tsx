import { CSSProperties, memo } from 'react';
import useControlledState from 'use-merge-value';

import Markdown from '@/Markdown';
import MessageInput, { type MessageInputProps } from '@/MessageInput';
import MessageModal, { type MessageModalProps } from '@/MessageModal';

export interface EditableMessageProps {
  /**
   * @title The class name for the Markdown and MessageInput component
   */
  classNames?: {
    /**
     * @title The class name for the MessageInput component
     */
    input?: string;
    /**
     * @title The class name for the Markdown component
     */
    markdown?: string;
    textarea?: string;
  };
  editButtonSize?: MessageInputProps['editButtonSize'];
  /**
   * @title Whether the component is in edit mode or not
   * @default false
   */
  editing?: boolean;
  height?: number;
  /**
   * @title Callback function when the value changes
   * @param value - The new value
   */
  onChange?: (value: string) => void;
  /**
   * @title Callback function when the editing state changes
   * @param editing - Whether the component is in edit mode or not
   */
  onEditingChange?: (editing: boolean) => void;
  /**
   * @title Callback function when the modal open state changes
   * @param open - Whether the modal is open or not
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * @title Whether the modal is open or not
   * @default false
   */
  openModal?: boolean;
  placeholder?: string;
  /**
   * @title Whether to show the edit button when the text value is empty
   * @default false
   */
  showEditWhenEmpty?: boolean;
  styles?: {
    /**
     * @title The style for the MessageInput component
     */
    input?: CSSProperties;
    /**
     * @title The style for the Markdown component
     */
    markdown?: CSSProperties;
  };
  text?: MessageModalProps['text'];
  /**
   * @title The current text value
   */
  value: string;
}

const EditableMessage = memo<EditableMessageProps>(
  ({
    value,
    onChange,
    classNames = {},
    onEditingChange,
    editing,
    openModal,
    onOpenChange,
    placeholder = 'Type something...',
    showEditWhenEmpty = false,
    styles,
    height,
    editButtonSize,
    text,
  }) => {
    const [isEdit, setTyping] = useControlledState(false, {
      onChange: onEditingChange,
      value: editing,
    });

    const [expand, setExpand] = useControlledState<boolean>(false, {
      onChange: onOpenChange,
      value: openModal,
    });

    const input = (
      <MessageInput
        className={classNames?.input}
        classNames={{ textarea: classNames?.textarea }}
        defaultValue={value}
        editButtonSize={editButtonSize}
        height={height}
        onCancel={() => setTyping(false)}
        onConfirm={(text) => {
          onChange?.(text);
          setTyping(false);
        }}
        placeholder={placeholder}
        style={styles?.input}
        text={text}
      />
    );

    if (!value && showEditWhenEmpty) return input;

    return (
      <>
        {!expand && isEdit ? (
          input
        ) : (
          <Markdown
            className={classNames?.markdown}
            style={{
              height,
              overflowX: 'hidden',
              overflowY: 'auto',
              ...styles?.markdown,
            }}
          >
            {value || placeholder}
          </Markdown>
        )}
        <MessageModal
          editing={isEdit}
          onChange={(text) => onChange?.(text)}
          onEditingChange={setTyping}
          onOpenChange={(e) => {
            setExpand(e);
            setTyping(false);
          }}
          open={expand}
          placeholder={placeholder}
          text={text}
          value={value}
        />
      </>
    );
  },
);

export default EditableMessage;
