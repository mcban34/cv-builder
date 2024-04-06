import React from 'react'
import { Link } from 'react-router-dom'
import useUserStore from '../store/useUserStore';

function Index() {
  const user = useUserStore(state => state.user);
  const logout = useUserStore(state => state.logoutUser);
  return (
    <div>
      <h2>Burası Ana Sayfa</h2>
      <button onClick={logout}>çıkış yap</button>
      <br /><br /><br />
      <Link to={"/"}>Go login</Link>
    </div>
  )
}

export default Index