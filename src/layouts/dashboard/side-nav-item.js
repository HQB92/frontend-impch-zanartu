import React, { useState } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { Box, ButtonBase, Collapse } from '@mui/material';

export const SideNavItem = (props) => {
  const {
    active = false,
    disabled,
    external,
    icon,
    path,
    title,
    subItems,
  } = props;
  const [isOpen, setIsOpen] = useState(false);

  const linkProps = path
    ? external
      ? {
          component: 'a',
          href: path,
          target: '_blank',
        }
      : {
          component: NextLink,
          href: path,
        }
    : {};

  const handleSubMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <ButtonBase
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          pl: '16px',
          pr: '16px',
          py: '6px',
          textAlign: 'left',
          width: '100%',
          ...(active && {
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
          }),
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
          },
        }}
        onClick={handleSubMenu}
        {...linkProps}
      >
        {icon && (
          <Box
            component="span"
            sx={{
              alignItems: 'center',
              color: 'neutral.400',
              display: 'inline-flex',
              justifyContent: 'center',
              mr: 2,
              ...(active && {
                color: 'primary.lightest',
              }),
            }}
          >
            {icon}
          </Box>
        )}
        <Box
          component="span"
          sx={{
            color: 'neutral.400',
            flexGrow: 1,
            fontFamily: (theme) => theme.typography.fontFamily,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: '24px',
            whiteSpace: 'nowrap',
            ...(active && {
              color: 'common.white',
            }),
            ...(disabled && {
              color: 'neutral.500',
            }),
          }}
        >
          {title}
        </Box>
      </ButtonBase>
      {subItems && (
        <Collapse in={isOpen} sx={{ pl: '30px' }}>
          {subItems.map((subItem) => (
            <SideNavItem key={subItem.path} {...subItem} />
          ))}
        </Collapse>
      )}
    </>
  );
};

SideNavItem.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  icon: PropTypes.node,
  path: PropTypes.string,
  title: PropTypes.string.isRequired,
  subItems: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      title: PropTypes.string.isRequired,
    })
  ),
};
