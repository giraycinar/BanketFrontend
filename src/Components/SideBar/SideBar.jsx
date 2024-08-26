/* eslint-disable no-unused-vars */
import React from 'react'
import styles from './SideBar.module.css'
import Button from '@mui/material/Button';
import { Link } from '@mui/material';

const SideBar = () => {
  return (
    <div className={styles.sidebar}>
        <Link href="/survey-index"  underline="none" >Anket İşlemleri</Link>
        <Link href="/question-index"  underline="none" >Soru İşlemleri</Link>
        <Link href="/report"  underline="none" >Raporlar</Link>
        <Link href="/add-manager"  underline="none" >Yönetici Ekle</Link>
        <Link href="/user-profile"  underline="none" >Profil</Link>
    </div>
  )
}

export default SideBar;
