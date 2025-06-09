import React from 'react';
import { Box, VStack, Icon, Text, Flex, Button, useColorModeValue } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx';
import {
  MdDashboard,
  MdInventory,
  MdBuild,
  MdAssessment,
  MdInsights,
  MdSettings,
  MdLogout
} from 'react-icons/md';

const menuItems = [
  { path: '/dashboard', icon: MdDashboard, label: 'Dashboard' },
  { path: '/inventory', icon: MdInventory, label: 'Estoque' },
  { path: '/production', icon: MdBuild, label: 'Produção' },
  { path: '/reports', icon: MdAssessment, label: 'Relatórios' },
  { path: '/analytics', icon: MdInsights, label: 'Análises' },
  { path: '/settings', icon: MdSettings, label: 'Configurações', adminOnly: true }
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isAdmin } = useAuth();

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      w="64"
      bg={bg}
      borderRight="1px"
      borderColor={borderColor}
      py={8}
      position="sticky"
      top={0}
      h="100vh"
    >
      <VStack spacing={2} align="stretch">
        <Box px={8} mb={8}>
          <Text fontSize="2xl" fontWeight="bold" color="blue.500">
            MIX Tech
          </Text>
        </Box>

        <VStack spacing={1} align="stretch">
          {menuItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;
            
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                variant="ghost"
                justifyContent="flex-start"
                pl={8}
                py={3}
                w="full"
                bg={isActive ? 'blue.50' : 'transparent'}
                color={isActive ? 'blue.500' : 'gray.600'}
                _hover={{
                  bg: isActive ? 'blue.50' : 'gray.100',
                }}
              >
                <Flex align="center">
                  <Icon as={item.icon} boxSize={5} mr={3} />
                  <Text>{item.label}</Text>
                </Flex>
              </Button>
            );
          })}
        </VStack>

        <Box mt="auto" px={8}>
          <Button
            onClick={handleLogout}
            variant="ghost"
            justifyContent="flex-start"
            w="full"
            leftIcon={<Icon as={MdLogout} boxSize={5} />}
            color="gray.600"
            _hover={{ bg: 'gray.100' }}
          >
            Sair
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar;