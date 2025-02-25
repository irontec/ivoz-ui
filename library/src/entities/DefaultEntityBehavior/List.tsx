import { ListContentProps } from '../../components/List/Content/ListContent';
import { ListContent } from '../../components/List/Content/';

const List = (props: ListContentProps): JSX.Element | null => {
  return <ListContent {...props} />;
};

export default List;
