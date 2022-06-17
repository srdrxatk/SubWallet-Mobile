import React, { useState } from 'react';
import { ImageBackground, Text, View } from 'react-native';
import { Images, SVGImages } from 'assets/index';
import { SubmitButton } from 'components/SubmitButton';
import { ColorMap } from 'styles/color';
import { FontMedium, sharedStyles } from 'styles/sharedStyles';
import { ArchiveTray, UserCirclePlus } from 'phosphor-react-native';
import { SelectImportAccountModal } from 'screens/FirstScreen/SelectImportAccountModal';

export const FirstScreen = () => {
  const [importSelectModalVisible, setSelectModalVisible] = useState<boolean>(false);

  return (
    <View style={{ width: '100%', height: 100, flex: 1 }}>
      <ImageBackground
        source={Images.loadingScreen}
        resizeMode={'cover'}
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingBottom: 45,
          position: 'relative',
        }}>
        <View style={{ paddingBottom: 98 }}>
          {
            // @ts-ignore
            <SVGImages.SubWallet2 width={230} height={230} />
          }
        </View>

        <SubmitButton
          leftIcon={UserCirclePlus}
          title={'Create a new wallet account'}
          style={{ marginBottom: 16, width: '100%' }}
        />

        <SubmitButton
          leftIcon={ArchiveTray}
          title={'Already have a wallet account'}
          style={{ width: '100%' }}
          backgroundColor={ColorMap.primary}
          onPress={() => setSelectModalVisible(true)}
        />

        <Text
          style={{
            ...sharedStyles.mainText,
            color: ColorMap.light,
            textAlign: 'center',
            paddingHorizontal: 60,
            paddingTop: 56,
            ...FontMedium,
          }}>
          By continuing, you agree to our Terms and Privacy Policy
        </Text>

        <SelectImportAccountModal
          modalVisible={importSelectModalVisible}
          onChangeModalVisible={() => setSelectModalVisible(false)}
        />
      </ImageBackground>
    </View>
  );
};