'use client';
/* eslint-disable */
/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, { FormEvent } from 'react';
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
// Custom components
import { HSeparator } from 'components/separator/Separator';
import DefaultAuthLayout from 'layouts/auth/Default';
// Assets
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { useClerk, useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SignIn2() {
  // Chakra color mode
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const googleBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.200');
  const googleText = useColorModeValue('navy.700', 'white');
  const googleHover = useColorModeValue(
    { bg: 'gray.200' },
    { bg: 'whiteAlpha.300' },
  );
  const googleActive = useColorModeValue(
    { bg: 'secondaryGray.300' },
    { bg: 'whiteAlpha.200' },
  );
  const a = useSignIn();
  const clerk = useClerk();

  
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);


  const submit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      await a.signIn.create({strategy: "password", identifier: username, password });
      clerk.redirectToAfterSignIn();
    } catch (error) {
        console.log(error);
        
    }
  }

  return (
    <SignIn.Root>
      <SignIn.Step name="start">
        <DefaultAuthLayout illustrationBackground={'/img/auth/auth.jpg'}>
          <Flex
            maxW={{ base: '100%', md: 'max-content' }}
            w="100%"
            mx={{ base: 'auto', lg: '0px' }}
            me="auto"
            h="100%"
            alignItems="start"
            justifyContent="center"
            mb={{ base: '30px', md: '60px' }}
            px={{ base: '25px', md: '0px' }}
            mt={{ base: '40px', md: '14vh' }}
            flexDirection="column"
          >
            <Box me="auto">
              <Heading color={textColor} fontSize="36px" mb="10px">
                Sign In
              </Heading>
              <Text
                mb="36px"
                ms="4px"
                color={textColorSecondary}
                fontWeight="400"
                fontSize="md"
              >
                Enter your email and password to sign in!
              </Text>
            </Box>
            <Flex
              zIndex="2"
              direction="column"
              w={{ base: '100%', md: '420px' }}
              maxW="100%"
              background="transparent"
              borderRadius="15px"
              mx={{ base: 'auto', lg: 'unset' }}
              me="auto"
              mb={{ base: '20px', md: 'auto' }}
            >
                <Button
                  fontSize="sm"
                  me="0px"
                  mb="26px"
                  py="15px"
                  h="50px"
                  borderRadius="16px"
                  bgColor={googleBg}
                  color={googleText}
                  fontWeight="500"
                  _hover={googleHover}
                  _active={googleActive}
                  _focus={googleActive}
                >
                  <Icon as={FcGoogle} w="20px" h="20px" me="10px" />
                  <Clerk.Connection name="google">
                    Sign in with Google
                  </Clerk.Connection>
                </Button>
                <Button
                  fontSize="sm"
                  me="0px"
                  mb="26px"
                  py="15px"
                  h="50px"
                  borderRadius="16px"
                  bgColor={googleBg}
                  color={googleText}
                  fontWeight="500"
                  _hover={googleHover}
                  _active={googleActive}
                  _focus={googleActive}
                >
                  <Clerk.Connection name="microsoft">
                    Sign in with Microsoft
                  </Clerk.Connection>
                </Button>
              <Flex align="center" mb="25px">
                <HSeparator />
                <Text color="gray.400" mx="14px">
                  or
                </Text>
                <HSeparator />
              </Flex>
                <FormControl>
                  <Clerk.Field name="identifier">
                    <Clerk.Input value={username} hidden />
                    <FormLabel
                      display="flex"
                      ms="4px"
                      fontSize="sm"
                      fontWeight="500"
                      color={textColor}
                      mb="8px"
                    >
                      Email<Text color={brandStars}>*</Text>
                    </FormLabel>
                    <Input
                      isRequired={true}
                      variant="auth"
                      fontSize="sm"
                      ms={{ base: '0px', md: '0px' }}
                      type="text"
                      placeholder="mail@simmmple.com"
                      mb="24px"
                      fontWeight="500"
                      size="lg"
                      onChange={({currentTarget: {value}}) => setUsername(value)}
                    />
                    <Clerk.FieldError />
                  </Clerk.Field>
                
                <Clerk.Field name="password">
                  <Clerk.Input value={password} hidden />
                  <FormLabel
                      ms="4px"
                      fontSize="sm"
                      fontWeight="500"
                      color={textColor}
                      display="flex"
                    >
                      Password<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <InputGroup size="md">
                    <Input
                      isRequired={true}
                      fontSize="sm"
                      placeholder="Min. 8 characters"
                      mb="24px"
                      size="lg"
                      type={show ? 'text' : 'password'}
                      variant="auth"
                      onChange={({currentTarget: {value}}) => setPassword(value)}
                    />
                    <InputRightElement display="flex" alignItems="center" mt="4px">
                      <Icon
                        color={textColorSecondary}
                        _hover={{ cursor: 'pointer' }}
                        as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                        onClick={handleClick}
                      />
                    </InputRightElement>
                  </InputGroup>
                </Clerk.Field>
              </FormControl>
              <Flex justifyContent="space-between" align="center" mb="24px">
                <SignIn.Action navigate="forgot-password">
                  <Text
                    color={textColorBrand}
                    fontSize="sm"
                    w="124px"
                    fontWeight="500"
                  >
                    Forgot password?
                  </Text>
                </SignIn.Action>
              </Flex>
              <Button
                type='submit'
                fontSize="sm"
                variant="brand"
                fontWeight="500"
                w="100%"
                h="50"
                mb="24px"
              >
                <SignIn.Action submit>Sign In</SignIn.Action>
              </Button>
            </Flex>
          </Flex>
        </DefaultAuthLayout>
      </SignIn.Step>
    </SignIn.Root>
  );
}
