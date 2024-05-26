"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { Card, Space } from "antd";
import { useRouter } from "next/navigation";

const StatisticsPage = () => {
  const [genderDist, setGenderDist] = useState([]);
  const [ageDist, setAgeDist] = useState([]);
  const [eventGenderDist, setEventGenderDist] = useState([]);
  const [ticketTypeDist, setTicketTypeDist] = useState([]);
  const [eventAgeDist, setEventAgeDist] = useState([]);
  const [eventRevExp, setEventRevExp] = useState([]);

  const router = useRouter();

  interface DataSet {
    label: string;
    data: unknown[];
    backgroundColor: string;
  }

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) router.push("/");

    axios.get("/api/statistics/genderDistribution").then((response) => {
      setGenderDist(response.data);
    });
    axios.get("/api/statistics/ageDistribution").then((response) => {
      setAgeDist(response.data);
    });
    axios.get("/api/statistics/eventGenderDistribution").then((response) => {
      // console.log(response.data);
      setEventGenderDist(response.data);
    });
    axios.get("/api/statistics/ticketTypeDistribution").then((response) => {
      setTicketTypeDist(response.data);
    });
    axios
      .get("/api/statistics/eventAgeDistribution")
      .then((response) => setEventAgeDist(response.data));
    axios
      .get("/api/statistics/eventRevenueExpense")
      .then((response) => setEventRevExp(response.data));
  }, []);

  const processSimpleData = (data, labelKey) => {
    const labels = data.map((item) => item[labelKey]);
    const values = data.map((item) => item.count);
    return {
      labels,
      datasets: [
        {
          label: labelKey,
          data: values,
          backgroundColor: labels.map(
            () => "#" + Math.floor(Math.random() * 16777215).toString(16)
          ),
        },
      ],
    };
  };

  const processGroupedData = (data, labelKey) => {
    const groups = [...new Set(data.map((item) => item.event))];

    const labels = [...new Set(data.map((item) => item[labelKey]))];

    const datasets: DataSet[] = labels.map((label: any) => ({
      label,
      data: groups.map((groupName) => {
        const item = data.find(
          (d) => d.event === groupName && d[labelKey] === label
        );
        return item ? item.count : 0;
      }),
      backgroundColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
    })) satisfies DataSet[];

    console.log();
    console.log("----------------");
    console.log();
    console.log("data:");
    console.log(data);
    console.log("groupKey:");
    console.log("event");
    console.log("labelKey:");
    console.log(labelKey);
    console.log("dataKey:");
    console.log("count");

    console.log("Groups:");
    console.log(groups);
    console.log("Labels:");
    console.log(labels);

    console.log("DataSet:");
    console.log(datasets);

    console.log("----------------");
    console.log();

    return { labels: groups, datasets };
  };

  const processRevenueExpenseData = (data) => {
    const labels = data.map((item) => item.event);
    return {
      labels,
      datasets: [
        {
          label: "Revenue",
          data: data.map((item) => item.revenue),
          backgroundColor: "#36A2EB",
        },
        {
          label: "Expense",
          data: data.map((item) => item.expense),
          backgroundColor: "#FF6384",
        },
      ],
    };
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card title="Gender Distribution">
        <Pie data={processSimpleData(genderDist, "gender")} />
      </Card>
      <Card title="Age Distribution">
        <Bar data={processSimpleData(ageDist, "age")} />
      </Card>
      <Card title="Event Gender Distribution">
        <Bar data={processGroupedData(eventGenderDist, "gender")} />
      </Card>
      <Card title="Ticket Type Distribution">
        <Bar data={processGroupedData(ticketTypeDist, "ticketType")} />
      </Card>
      <Card title="Event Age Distribution">
        <Bar data={processGroupedData(eventAgeDist, "age")} />
      </Card>
      <Card title="Event Revenue and Expense">
        <Bar data={processRevenueExpenseData(eventRevExp)} />
      </Card>
    </Space>
  );
};

export default StatisticsPage;
