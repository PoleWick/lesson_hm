import React, { useEffect, useState } from "react";
import { useLocation,useParams } from 'react-router-dom';
import qs from 'query-string';
import { getBillDetail } from '@/api';
import AppHeader from '@/components/AppHeader';
import s from './style.module.less';
import CustomIcon from '@/components/CustomIcon';
import { typeMap } from '@/utils'; // 全局配置
import cx from 'classnames'; // 类名绑定

const Detail = () => {
    const location = useLocation();
    const { id } = useParams();
    const [detail, setDetail] = useState({});

    const getDetial = async () => {
        try {
            const { data } = await getBillDetail(id);
            setDetail(data);
        } catch (error) {
            console.error("Failed to fetch bill details", error);
        }
    }

    useEffect(() => {
        getDetial();
    }, []);

    return (
        <div className={s.detail}>
            <AppHeader title="账单详情" />
            <div className={s.card}>
                <div className={s.type}>
                    <span className={cx({[s.expense]:detail.pay_type==1,[s.income]:detail.pay_type==2})}>
                        <CustomIcon>
                            className={s.iconfont}
                            type={detail.type_id?typeMap[detail.type_id].icon:1}
                        </CustomIcon>
                    </span>
                    <span>{detail.type_name}</span>
                </div>
                <div className={s.amount}>
                    <span className={s.title}>金额</span>
                    <span>{detail.amount || '-'}</span>
                </div>
                <div className={s.date}>
                    <span className={s.title}>日期</span>
                    <span>{detail.date || '-'}</span>
                </div>
                <div className={s.remark}>
                    <span className={s.title}>备注</span>
                    <span>{detail.remark || '-'}</span>
                </div>
            </div>
        </div>
    )
}

export default Detail;