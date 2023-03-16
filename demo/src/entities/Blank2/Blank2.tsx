import DefaultEntityBehavior from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import EntityInterface from '@irontec/ivoz-ui/entities/EntityInterface';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

const Blank: EntityInterface = {
  ...DefaultEntityBehavior,
  icon: ChatBubbleIcon,
  iden: 'Blank2',
  title: 'Blank2',
  path: '/blank2',
  properties: {},
  acl: {
    create: false,
    read: true,
    detail: false,
    update: false,
    delete: false,
  }
};

export default Blank;
