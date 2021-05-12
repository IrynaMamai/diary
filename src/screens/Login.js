import React, { useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Text, IconButton, TextInput, FAB, Appbar, Title, Portal, Modal, Card, Button, Paragraph, Dialog, Provider } from 'react-native-paper'


import { Icon } from 'native-base';
import * as LocalAuthentication from 'expo-local-authentication';
import { connect } from 'react-redux';

import { useSelector } from 'react-redux'
import styled, { ThemeProvider } from "styled-components"

import { useTranslation } from 'react-i18next'
import '../translete/i18n'
import ViewNotes from './ViewNotes';


function Login({ navigation }) {
    const { t, i18n } = useTranslation();

    const [failedCount, SetFiledCount] = React.useState(false);
    const theme = useSelector((state) => state.themeReducer.theme)

    async function scanFingerPrint() {
        SetFiledCount(false)

        try {
            let isHas = await LocalAuthentication.hasHardwareAsync();
            if (isHas) {
                let results = await LocalAuthentication.authenticateAsync();
                if (results.success) {
                    navigation.navigate('ViewNotes');
                } else {
                    SetFiledCount(true)
                }
            } else {
                navigation.navigate('ViewNotes');
            }

        } catch (e) {
            console.log(e);
        }
    };


    return (
        <ThemeProvider theme={theme}>
            <Appbar.Header style={{ backgroundColor: theme.PRIMARY_HEADER_COLOR }}>
                <Appbar.Content title={t("~ DIARY ~")}></Appbar.Content>
            </Appbar.Header>

            <Container>
                <TouchableOpacity onPress={() => scanFingerPrint()}>
                    <View style={{ alignItems: "center" }}>
                        <Icon style={{ fontSize: 90, color: theme.PRIMARY_BUTTON_COLOR }} name="fingerprint" type="MaterialIcons" />
                    </View>

                    {failedCount ?
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ color: theme.PRIMARY_BUTTON_COLOR, fontSize: 19, paddingTop: 15 }}>{t("Please try again")}</Text>
                        </View>
                        :
                        null
                    }

                </TouchableOpacity>
            </Container>
        </ThemeProvider>
    )
}

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
  padding-vertical: 20px;
  padding-horizontal: 10px;
  padding-top: 190px;
`;

export default Login;