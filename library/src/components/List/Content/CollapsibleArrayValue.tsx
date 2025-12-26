import { useState } from 'react';
import { Box, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTranslation } from 'react-i18next';

interface CollapsibleArrayValueProps {
  values: string;
  maxVisibleItems?: number;
}

const CollapsibleArrayValue = (
  props: CollapsibleArrayValueProps
): JSX.Element => {
  const { values, maxVisibleItems = 3 } = props;
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();

  const items = values.split(',').map((item) => item.trim());

  const shouldCollapse = items.length > maxVisibleItems;
  const displayedItems =
    shouldCollapse && !expanded ? items.slice(0, maxVisibleItems) : items;

  return (
    <Box
      component='span'
      sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
    >
      <span>{displayedItems.join(', ')}</span>
      {shouldCollapse && (
        <Button
          size='small'
          onClick={() => setExpanded(!expanded)}
          sx={{
            minWidth: 'auto',
            p: 0.5,
            fontSize: '0.75rem',
            textTransform: 'none',
          }}
          endIcon={
            expanded ? (
              <ExpandLessIcon fontSize='small' />
            ) : (
              <ExpandMoreIcon fontSize='small' />
            )
          }
        >
          {expanded
            ? t('Less')
            : `+${items.length - maxVisibleItems} ${t('more')}`}
        </Button>
      )}
    </Box>
  );
};

export default CollapsibleArrayValue;
